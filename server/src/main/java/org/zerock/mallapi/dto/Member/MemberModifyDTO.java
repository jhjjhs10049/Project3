package org.zerock.mallapi.dto.Member;

import lombok.Data;

@Data
public class MemberModifyDTO {

    private String email;

    private String pw;

    private String nickname;
}
