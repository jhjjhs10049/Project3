package org.zerock.mallapi.service.ShoppingCart;

import jakarta.transaction.Transactional;

import java.util.List;

import org.zerock.mallapi.dto.ShoppingCart.CartItemDTO;
import org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO;

@Transactional
public interface CartService {

    //장바구니 아이템의 추가 혹은 변경
    public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO);

    //모든 장바구니 아이템 목록
    public List<CartItemListDTO> getCartItems(String email);

    //아이템 삭제(삭제후 카트에 남은 CartItem 들을 리턴해준다)
    public List<CartItemListDTO> remove(Long cino);
}
