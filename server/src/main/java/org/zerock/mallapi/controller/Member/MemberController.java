package org.zerock.mallapi.controller.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.domain.Member.MemberRole;
import org.zerock.mallapi.dto.Member.MemberJoinDTO;
import org.zerock.mallapi.repository.Member.MemberRepository;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/member")
public class MemberController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody MemberJoinDTO memberJoinDTO) {
        try {
            log.info("Join request: " + memberJoinDTO);

            // 이메일 중복 체크
            if (memberRepository.existsById(memberJoinDTO.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "이미 존재하는 이메일입니다."));
            }

            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(memberJoinDTO.getPw());

            // Member 엔티티 생성
            Member member = Member.builder()
                    .email(memberJoinDTO.getEmail())
                    .pw(encodedPassword)
                    .nickname(memberJoinDTO.getNickname())
                    .social(false)
                    .build();

            // 기본 권한 추가
            member.addRole(MemberRole.USER);

            // DB 저장
            memberRepository.save(member);

            log.info("Member registered successfully: " + member.getEmail());

            return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));

        } catch (Exception e) {
            log.error("Join error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", "회원가입 중 오류가 발생했습니다."));
        }
    }
}
