package org.zerock.mallapi.service.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.domain.Member.MemberRole;
import org.zerock.mallapi.dto.Member.MemberDTO;
import org.zerock.mallapi.dto.Member.MemberModifyDTO;
import org.zerock.mallapi.repository.Member.MemberRepository;

import java.util.LinkedHashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public MemberDTO getKakaoMember(String accessToken) {
        // 카카오에 accessToken 을 전송하고 사용자 정보를 받아온다.
        String email = getEmailFromKakaoAccessToken(accessToken);

        log.info("email:" + email);

        Optional<Member> result = memberRepository.findById(email);

        //기존의 회원
        if(result.isPresent()){ //result 에 값이 들어있으면
            // Member -> MemberDTO
            MemberDTO memberDTO = entityToDTO(result.get());

            return memberDTO;
        }
        //회원이 아니었다면
        //닉네임은 '소셜회원' 으로
        //패스워드는 임의로 생성
        Member socialmember = makeSocialmember(email);//DB에 없는 유저인 경우 소셜유저를 하나 생성
        memberRepository.save(socialmember); // 소셜 유저를 DB에 저장

        MemberDTO memberDTO = entityToDTO(socialmember);

        return memberDTO;
    }
    // 카카오에 accessToken 을 전송하고 사용자 정보를 받아온다.
    private String getEmailFromKakaoAccessToken(String accessToken){
        // accessToken 을 전송할 kakao 주소
        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if(accessToken == null){
            throw new RuntimeException("Access Token is null");
        }

       /**********************************************************************************************
        * RestTemplate ? 스프링에서 제공하는 http 클라이언트(자바 코드로 외부 API 를 호출할 수 있게 해주는 도구)
        * RestTemplate 쓰는 이유?
        * 외부서버(여기서는 카카오)에 GET, POST 등 HTTP 요청을 보내기 위해
        * OAuth 인증, 카카오 API, 네이버 로그인 등 외부 서비스 연동시 자주 사용
        ***********************************************************************************************/
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        // 카카오 같은 OAuth2.0 서버는 JSON 이 아니라 폼 데이터를 원한다.
        // RestTemplate 은 java 객체 -> JSON 으로 변환해서 전송한다. 타입이 맞지 않다.
        // 그래서 application/x-www-form-urlencoded 로 직접 지정했다.
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        //HttpEntity ? HTTP 메세지의 헤더와 바디를 함께 묶는 객체입니다.
        HttpEntity<String> entity = new HttpEntity<>(headers);

        /**************************************************
         * UriComponentsBuilder ?
         * 고정된 URL 을 사용할 때는 필요가 없다.
         * 하지만 동적인 URL 조립시에 사용 한다. 예를 들면
         * Query parameter 를 붙일 때, Path parameter 를 조립할 때, 조건에 따라 URL을 유동적으로 만들 때 입니다.
         ****************************************************/

        //fromUriString(String uri) 은 "http://" 또는 "https://" 로 시작하는 절대 URL 을 기반으로 UriComponentsBuilder 객체를 생성합니다.
        UriComponents uriBuilder = UriComponentsBuilder.fromUriString(kakaoGetUserURL).build();

        //restTemplate.exchange() ?
        //GET, POST, PUT, DELETE 등 다양한 HTTP 메서드와 요청 헤더, 바디 응답 타입을 자유롭게 설정할수 있다.
        //카카오에 accessToken 을 전송하고 response 로 결과를 받음
        //그런데 왜 LinkedHashMap 타입을 사용하나?
        //카카오에서 반환하는 정보를 LinkedHashMap 을 사용하면 큰 변환 없이 그대로 사용 가능
        //HashMap 은 순서를 보장 하지 않지만, LinkedHashMap 은 입력 순서를 유지한다.
        ResponseEntity<LinkedHashMap<String, Object>> response = restTemplate.exchange( //exchange : 교환하다.
                uriBuilder.toString(),  // 요청할 URL
                HttpMethod.GET,         // GET 방식
                entity,                 // 요청 헤더 + 바디를 포함한 객체(여기서는 accessToken)
                new org.springframework.core.ParameterizedTypeReference<LinkedHashMap<String, Object>>() {});   // 응답으로 기대하는 타입(예: String.class, User.class)

        log.info(response);
        LinkedHashMap<String, Object> bodyMap = response.getBody();

        log.info("-------------------------------");
        log.info(bodyMap);

        Object kakaoAccountObj = bodyMap.get("kakao_account");
        LinkedHashMap<String, Object> kakaoAccount = null;
        if (kakaoAccountObj instanceof LinkedHashMap) {
            @SuppressWarnings("unchecked")
            LinkedHashMap<String, Object> temp = (LinkedHashMap<String, Object>) kakaoAccountObj;
            kakaoAccount = temp;
        } else {
            throw new RuntimeException("kakao_account is not a LinkedHashMap");
        }

        log.info("kakaoAccount: " + kakaoAccount);

        return (String) kakaoAccount.get("email");
    }

    //소셜 로그인 후 임시 비밀번호를 랜덤으로 생성 (pw를 모르니까 일반 로그인이 안됨)
    //소셜 로그인 후 회원 정보를 수정할 수 있도록 구성하고 사용자가 원하는 pw로 변경 해야 한다.)
    private String makeTempPassword(){

        StringBuffer buffer = new StringBuffer();

        for(int i=0; i<10; i++){
            buffer.append( (char) ( (int)(Math.random()*55) + 65 ));
        }

        return buffer.toString();
    }    //소셜 로그인을 했는데 기존 유저(DB에 있는 유저)가 아닌경우 소셜회원을 하나 만든다.
    private Member makeSocialmember(String email){
        // 랜덤으로 만든 임시 비밀번호(사용자도 관리자도 알수 없다.)
        String tempPassword = makeTempPassword();

        log.info("tempPassword: " + tempPassword);

        // 이메일의 @ 앞부분을 닉네임으로 사용
        String nickname = email.substring(0, email.indexOf("@"));
        log.info("자동 생성된 닉네임: " + nickname);

        Member member = Member.builder()
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .nickname(nickname)
                .social(false) // 일반 회원으로 설정
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }@Override
    public void modifyMember(MemberModifyDTO memberModifyDTO) {

        Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());

        Member member = result.orElseThrow();        member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
        member.changeSocial(false); // 일반 회원으로 등록
        member.changeNickname(memberModifyDTO.getNickname());

        memberRepository.save(member); // 회원 정보 수정
    }
}
