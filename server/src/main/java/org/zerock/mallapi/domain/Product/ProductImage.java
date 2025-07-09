package org.zerock.mallapi.domain.Product;

import jakarta.persistence.Embeddable;
import lombok.*;

//@Embeddable 을 사용하는 경우  PK가 생성 되지 않기 때문에
//모든 작업은 PK를 가지는 엔티티로 구성 한다는 특징이 있다.
@Embeddable
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage {
    private String fileName;

    private int ord;

    public void setOrd(int ord) {
        this.ord = ord;
    }
}
