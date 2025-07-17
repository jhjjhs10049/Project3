package org.zerock.mallapi.dto.Member;

import lombok.Data;

@Data
public class MemberJoinDTO {
    private String email;
    private String pw;
    private String nickname;
}
