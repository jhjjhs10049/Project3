package org.zerock.mallapi.domain.Member;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString (exclude = "memberRoleList")
public class Member {

    @Id
    private String email;

    private String pw;
    private String nickname;
    private boolean social;

    //@ElementCollection 은 엔티티가 아닌 값 타입 컬렉션을 별도의 테이블에 저장할 수 있도록 해줍니다.
    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();

    public void addRole(MemberRole memberRole){
        memberRoleList.add(memberRole);
    }

    public void clearRole(){
        memberRoleList.clear();
    }

    public void changeNickname(String nickname){
        this.nickname = nickname;
    }

    public void changePw(String pw){
        this.pw = pw;
    }

    public void changeSocial(boolean social){
        this.social = social;
    }







}
