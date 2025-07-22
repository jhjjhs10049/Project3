package org.zerock.mallapi.controller.ShoppingCart;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.ShoppingCart.CartItemDTO;
import org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO;
import org.zerock.mallapi.service.ShoppingCart.CartService;

import java.security.Principal;
import java.util.List;

/****************************************************************
 * Cart : 한 명의 사용자에게 하나씩 있는 장바구니 전체
 * CartItem : 그 장바구니 안에 담긴 개별 상품 하나하나
 * CartItem Number (cino) : 이 개별 상품(CartItem)에 붙는 고유 ID
 ****************************************************************/


@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/cart")
// '/api/member'를 제외한 모든 기능은 JWTCheckFilter 를 거치기 때문에
// 스프링 시큐리티 관련 기능을 사용해서 구현 해야 한다.
public class CartController {

    private final CartService cartService;


    //현재 로그인한 사용자의 이메일과 파라미터로 전달된 CartItemDTO의 이메일 주소가 같으면 호출
    @PreAuthorize("#itemDTO.email == authentication.name")
    @PostMapping("/change")
    public List<CartItemListDTO> changeCart (@RequestBody CartItemDTO itemDTO){

        log.info(itemDTO);

        if(itemDTO.getQty() <= 0){  // 수량이 0, 0보다 적으면
            // 삭제후 남은 장바구니 상태를 리턴(List<CartItemListDTO> 타입 리턴)
            return cartService.remove(itemDTO.getCino());
        }
        //수량이 0보다 크면 추가 or 수정 후
        //현재 사용자의 장바구니 아이템 목록을 리턴(List<CartItemListDTO> 타입 리턴)
        return cartService.addOrModify(itemDTO);
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')")
    //@PreAuthorize("isAuthenticated()") //<-- 인증한 사용자 접근이 맞는거 아닌가?
    @GetMapping("/items")   // Principal : 현재 사용자의 정보를 가진 객체
    public List<CartItemListDTO> getCartItems(Principal principal){

        String email = principal.getName();
        log.info("----------------------------");
        log.info("email: " + email);

        //현재 사용자의 장바구니 아이템 목록을 리턴
        return cartService.getCartItems(email);
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')")
    //@PreAuthorize("isAuthenticated()") //<-- 인증한 사용자 접근이 맞는거 아닌가?
    @DeleteMapping("/{cino}")
    // 해당 수량(qty)이 0 이하가 되면 /change 에서 처리가 되기 때문에
    // 실제로 이 경로를 호출해서 삭제할 가능성은 많지 않다.
    public List<CartItemListDTO> removeFromCart( @PathVariable("cino") Long cino){

        log.info("cart item no : " + cino);

        //삭제후 남은 장바구니 상태를 리턴
        return cartService.remove(cino);
    }

}
