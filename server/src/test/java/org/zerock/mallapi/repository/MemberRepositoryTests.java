package org.zerock.mallapi.repository;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.domain.Member.MemberRole;
import org.zerock.mallapi.repository.Member.MemberRepository;

@SpringBootTest
@Log4j2
public class MemberRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertMember(){
        for (int i=0; i<10; i++){
            Member member = Member.builder()
                    .email("user"+i+"@aaa.com")
                    .pw(passwordEncoder.encode("1111"))
                    .nickname("USER" + i)
                    .build();

            member.addRole(MemberRole.USER);

            if( i >= 5){
                member.addRole(MemberRole.MANAGER);
            }

            if(i >= 8){
                member.addRole(MemberRole.ADMIN);
            }
            memberRepository.save(member);
        }
    }

    @Transactional
    @Test
    public void testRead(){
        //user9는 USER/MANAGER/ADMIN 3개의 권한을 가진다.
        String email = "user9@aaa.com";
            // 쿼리는 정상 이다.
        Member member = memberRepository.getWithRoles(email);

        log.info("---------------");
        log.info(member);
        
        // email 유저가 가지고 있는 권한들 확인
        log.info("Roles: {}", member.getMemberRoleList());
    }



}
