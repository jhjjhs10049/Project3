package org.zerock.mallapi.service.ShoppingCart;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.domain.Product.Product;
import org.zerock.mallapi.domain.ShoppingCart.Cart;
import org.zerock.mallapi.domain.ShoppingCart.CartItem;
import org.zerock.mallapi.dto.ShoppingCart.CartItemDTO;
import org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO;
import org.zerock.mallapi.repository.ShoppingCart.CartItemRepository;
import org.zerock.mallapi.repository.ShoppingCart.CartRepository;

import java.util.List;
import java.util.Optional;

/****************************************************************
 * Cart : 한 명의 사용자에게 하나씩 있는 장바구니 전체
 * CartItem : 그 장바구니 안에 담긴 개별 상품 하나하나
 * CartItem Number (cino) : 이 개별 상품(CartItem)에 붙는 고유 ID
 ****************************************************************/

@RequiredArgsConstructor
@Service
@Log4j2
public class CartServiceImpl implements CartService{

    private final CartRepository  cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO) {

        String email = cartItemDTO.getEmail();
        Long pno = cartItemDTO.getPno();
        int qty = cartItemDTO.getQty();
        Long cino = cartItemDTO.getCino();//CartItem 번호

        //장바구니 아이템 번호가 있어서 수량만 변경하는 경우
        if(cino != null){
            Optional<CartItem> cartItemResult = cartItemRepository.findById(cino);
            CartItem cartItem = cartItemResult.orElseThrow();
            cartItem.changeQty(qty);
            cartItemRepository.save(cartItem);

            return getCartItems(email);
        }
        //장바구니 아이템 번호 cino 가 없는 경우
        //사용자의 카트
        Cart cart = getCart(email);

        CartItem cartItem = null;

        //이미 동일한 상품이 담긴적이 있을수 있으므로
        //email 사용자의 cartItem 정보를 받아온다.
        cartItem = cartItemRepository.getItemOfPno(email, pno);

        if(cartItem == null){   // 동일한 cartItem 이 없다면
            // pno 를 가지는 상품(product) 을 만들고
            Product product = Product.builder().pno(pno).build();
            // product, cart, qty 정보를 가지는 cartItem 을 만든다.
            cartItem = CartItem.builder().product(product).cart(cart).qty(qty).build();
        }else{  // 사용자의 카트에 동일한 cartItem 이 있다면 수량만 변경
            cartItem.changeQty(qty);
        }

        //상품 아이템 저장
        cartItemRepository.save(cartItem);
        //현재 사용자의 장바구니 아이템 목록을 리턴
        return getCartItems(email);
    }


    //사용자의 장바구니가 없었다면 새로운 장바구니를 생성하고 반환
    private Cart getCart(String email){

        Cart cart = null;
        Optional<Cart> result = cartRepository.getCartOfMember(email);

        //사용자의 장바구니가 없다면
        if(result.isEmpty()){
            log.info("Cart of the member is not exist!!");

            //cart 를 만들려면 cart 의 주인이 있어야 하므로 member 부터 만든다.
            Member member = Member.builder().email(email).build();
            Cart tempCart = Cart.builder().owner(member).build();

            //장바구니를 생성
            cart = cartRepository.save(tempCart);

        }else{  // 사용하던 장바구니가 있으면
            cart = result.get();
        }
        return cart;
    }


    @Override
    public List<CartItemListDTO> getCartItems(String email) {
        //현재 사용자의 장바구니 아이템 목록
        return cartItemRepository.getItemsOfCartDTOByEmail(email);
    }


    @Override
    public List<CartItemListDTO> remove(Long cino) {
        //cartItem 번호로 cart 번호를 찾는다
        Long cno = cartItemRepository.getCartFromItem(cino);
        log.info("cart no : " + cno);
        cartItemRepository.deleteById(cino);

        //삭제후 남은 장바구니 상태를 리턴
        return cartItemRepository.getItemsOfCartDTOByCart(cno);
    }
}
