package org.zerock.mallapi.dto.Member;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString   //MemberDTO 는 스프링 시큐리티에서 이용하는 타입의 객체로 만들었다.그래서 USER 를 상속
public class MemberDTO extends User {
//USER 객체 : Spring Security 에서 제공하는 인증용 사용자 객체
//           주로 로그인 된 사용자의 정보를 담기 위한 용도로 사용
    private String email;
    private String pw;
    private String nickName;
    private boolean social;
    private List<String> roleNames = new ArrayList<>();

    public MemberDTO(String email, String pw, String nickName,
                     boolean social, List<String> roleNames ) {
        //SimpleGrantedAuthority : spring Security 에서 사용자의 권한을 나타내기위한 클래스
        // 역할 또는 권한을 표현할 때 사용("ROLE_USER", "ROLE_ADMIN" 등)로 권한을 나타냄
        //roleNames 에서 권한을 하나씩 꺼내서 SimpleGrantedAuthority 의 생성자의 매개변수로
        //String 타입의 변수를 전송한다.
        super(email, pw, roleNames.stream().map(str ->
                new SimpleGrantedAuthority("ROLE_"+str)).collect(Collectors.toList()));

        this.email = email;
        this.pw = pw;
        this.nickName = nickName;
        this.social = social;
        this.roleNames = roleNames;
    }

    // 현재 사용자의 정보를 Map 타입으로 반환(이후에 JWT 문자열 생성시에 사용)
    public Map<String , Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickName", nickName);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }


}
