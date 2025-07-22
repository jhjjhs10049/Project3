package org.zerock.mallapi.dto.ShoppingCart;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/****************************************************************
 * Cart : 한 명의 사용자에게 하나씩 있는 장바구니 전체
 * CartItem : 그 장바구니 안에 담긴 개별 상품 하나하나
 * CartItem Number (cino) : 이 개별 상품(CartItem)에 붙는 고유 ID
 ****************************************************************/


@Data
@Builder
@NoArgsConstructor
public class CartItemListDTO { // 장바구니에 담긴 상품들 각각을 표현하는 DTO

    private Long cino;  // 장바구니 안의 하나의 상품정보에 대한 고유번호
    private int qty;
    private Long pno;
    private String pname;
    private int price;
    private String imageFile;

    public CartItemListDTO(Long cino, int qty, Long pno, String pname,
                           int price, String imageFile){
        this.cino = cino;
        this.qty = qty;
        this.pno = pno;
        this.pname = pname;
        this.price = price;
        this.imageFile = imageFile;
    }
}
