package org.zerock.mallapi.service.Member;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.dto.Member.MemberDTO;
import org.zerock.mallapi.dto.Member.MemberModifyDTO;

import java.util.stream.Collectors;

@Transactional
public interface MemberService {

    MemberDTO getKakaoMember(String accessToken);

    void modifyMember(MemberModifyDTO memberModifyDTO);


    //회원 정보는 MemberDTO 타입으로 처리되어야 하므로 Member 엔티티 객체를 MemberDTO 객체로 변환
    default MemberDTO entityToDTO(Member member){

        MemberDTO dto = new MemberDTO(
                member.getEmail(),
                member.getPw(),
                member.getNickname(),
                member.isSocial(),
                member.getMemberRoleList().stream().map(memberRole ->
                        memberRole.name()).collect(Collectors.toList()));

                return dto;
    }
}
