package org.zerock.mallapi.repository;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.domain.Product.Product;
import org.zerock.mallapi.domain.ShoppingCart.Cart;
import org.zerock.mallapi.domain.ShoppingCart.CartItem;
import org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO;
import org.zerock.mallapi.repository.ShoppingCart.CartItemRepository;
import org.zerock.mallapi.repository.ShoppingCart.CartRepository;

import java.util.List;
import java.util.Optional;

@SpringBootTest
@Log4j2
public class CartRepositoryTests {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    @Commit
    @Test
    public void testInsertByProduct() {

        log.info("test1-----------------------------");
        //사용자가 전송하는 정보
        String email = "user1@aaa.com";
        Long pno = 42L;  // 기존과 동일한 경우 JPA 특성상 update 가 실행되지 않는다.
        int qty = 2;    // 예: pno 와 qty 의 값이 이전값과 같으면 update 가 실행되지 않는다.


        //만일 기존에 사용자의 장바구니 아이템(cartItem)이 있다면
        CartItem cartItem = cartItemRepository.getItemOfPno(email, pno);
        if(cartItem != null) {
            cartItem.changeQty(qty);
            cartItemRepository.save(cartItem);  // 수량을 수정
        }

        // 장바구니 아이템이 없었다면 장바구니 부터 확인 필요

        //사용자가 장바구니를 만든적이 있는지 확인
        Optional<Cart> result = cartRepository.getCartOfMember(email);

        Cart cart = null;

        //사용자의 장바구니가 존재하지 않으면 장바구니 생성
        if(result.isEmpty()){
            log.info("MemberCart is not exist!!");
            // cart 를 만들려면 cart 의 주인이 있어야 하므로 member 부터 만든다
            Member member = Member.builder().email(email).build();
            Cart tempCart = Cart.builder().owner(member).build();

            cart = cartRepository.save(tempCart);//장바구니(cart) 생성
        }else {
            cart = result.get();
        }
        log.info(cart);
        //-----------------------------------------------
        if(cartItem == null){   // 사용자의 장바구니 아이템(cartItem)이 없다면
            Product product = Product.builder().pno(pno).build();
            cartItem = CartItem.builder().product(product).cart(cart).qty(qty).build();
        }
        //상품 아이템 저장
        cartItemRepository.save(cartItem);
    }

    @Test
    @Commit
    public void testUpdateByCino(){

        Long cino = 1L;

        int qty = 4;

        Optional<CartItem> result = cartItemRepository.findById(cino);

        CartItem cartItem = result.orElseThrow();

        cartItem.changeQty(qty);

        cartItemRepository.save(cartItem);//qty 의 값이 DB 에저장된 값과 다르다면 update 실행
    }

    @Test
    public void testListOfMember(){
        //현재 사용자의 장바구니 아이템 목록 테스트

        String email = "user1@aaa.com";
        //현재 사용자의 장바구나 아이템 목록
        List<CartItemListDTO> cartItemList = cartItemRepository.getItemsOfCartDTOByEmail(email);

        for(CartItemListDTO dto : cartItemList){
            log.info(dto);
        }
    }


    @Test
    public void testDeleteThenList() {
    // 장바구니 아이템 삭제후 해당 장바구에 남아있는 모든 아이템 목록을 다시 반환
    // 이테스트 의 이유는 ? 삭제후 남은 장바구니 상태를 사용자 에게 보여 주려고

        Long cino = 1L;

        //장바구니 번호
        Long cno = cartItemRepository.getCartFromItem(cino);

        //삭제는 임시로 주석처리
        //cartItemRepository.deleteById(cino);

        //목록
        List<CartItemListDTO> cartItemList = cartItemRepository.getItemsOfCartDTOByCart(cno);

        for(CartItemListDTO dto : cartItemList) {
            log.info(dto);
        }


    }

}
