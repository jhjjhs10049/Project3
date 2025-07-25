package org.zerock.mallapi.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.dto.Member.MemberDTO;
import org.zerock.mallapi.repository.Member.MemberRepository;

import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
//UserDetailsService : spring Security 에서 사용자 인증을 위해 사용자 정보를 로딩하는 인터페이스
    private final MemberRepository memberRepository;

    // 입력된 username 을 기준으로 사용자 정보를 DB 에서 조회
    // UserDetails 를 반환 (spring Security 가 인증 처리에 사용)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // 로그인 창에서 ID, PW 입력후 로그인 시 loadUserByUsername 로 들어옵니다.(로그인 성공/실패 상관없이)
    // 로그인 성공시 config.successHandler(new APILoginSuccessHandler()); 설정을 찾고
    // APILoginSuccessHandler 클래스의 onAuthenticationSuccess()로 이동 합니다.
    // 로그인 실패시 w.a.UsernamePasswordAuthenticationFilter : Failed to process authentication request 출력
    // 내부에 있는 UsernamePasswordAuthenticationFilter 필터객체를 통과하지 못했다.
    // BadCredentialsException 을 발생시키고 : 자격 증명에 실패하였습니다. 메세지 출력

        // 사용자 정보를 조회 하고 해당 사용자의 인증과 권한을 처리
        log.info("-----------loadUserByUsername-----------");

        Member member = memberRepository.getWithRoles(username);

        if(member == null){
            throw new UsernameNotFoundException("Not Found");
        }

        MemberDTO memberDTO = new MemberDTO(
                member.getEmail(),
                member.getPw(),
                member.getNickname(),
                member.isSocial(),
                member.getMemberRoleList()//유저의 모든 권한을 가져온다
                        .stream()//List<MemberRole> 타입을 List<String> 변환
                        .map(memberRole -> memberRole.name())
                        .collect(Collectors.toList()));

        log.info(memberDTO);

        return memberDTO;
    }
}
