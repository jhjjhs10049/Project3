package org.zerock.mallapi.dto.ShoppingCart;

import lombok.Data;

@Data
public class CartItemDTO {
    // CartItemDTO 가 사용되는 상황 ?
    // 상품조회 화면에서 사용자가 자신의 장바구니에 상품을 추가하는 경우
    // 장바구니 아이템 목록에서 상품 수량을 조정하는 경우

    private String email;

    private Long pno;

    private int qty;    // 수량

    private Long cino;  //  cartItem number
}
