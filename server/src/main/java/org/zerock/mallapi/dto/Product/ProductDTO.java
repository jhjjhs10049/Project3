package org.zerock.mallapi.dto.Product;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    private Long pno;
    private String pname;
    private int price;
    private String pdesc;
    private boolean delFlag;

    @Builder.Default    // 서버에 보내지는실제 파일 데이터
    private List<MultipartFile> files = new ArrayList<>();

    @Builder.Default    //업로드가 완료된 파일의 이름만 문자열로 저장한 리스트
    private List<String> uploadFileNames = new ArrayList<>();
}
