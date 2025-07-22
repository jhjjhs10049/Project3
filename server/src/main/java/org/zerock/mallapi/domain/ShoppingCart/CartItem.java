package org.zerock.mallapi.domain.ShoppingCart;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.mallapi.domain.Product.Product;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = "cart")// 인덱스 이름 name, 인덱스를 걸 컬럼의 이름 columnList
@Table(name = "tbl_cart_item", indexes = {
        @Index(columnList = "Cart_cno", name = "idx_cartitem_cart"),
        //idx_cartitem_pno_cart 인덱스는 두개의 컬럼에 인덱스를 걸고 있다.
        @Index(columnList = "product_pno, cart_cno", name = "idx_cartitem_pno_cart")
})
public class CartItem {
    //CartItem ? 장바구니(cart) 안에 담긴 '개별 상품 1개에 대한 정보' 을 나태내는 엔티티
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cino; //Cart Item Number

    /*******************************************************************
     * @ManyToOne 은 기본값이 즉시로딩입니다.
     * CartItem 을 조회 하면 JPA가 즉시 Product 와 Cart 도 함께 조회 합니다.
     * @ToString(exclude = "cart") 설정이 되어 있지만
     * 즉시로딩 설정 일 때에는 출력에만 영향을 줄뿐 cart 를 로딩 합니다.
     * 하지만 cart는 exclude가 설정 되어 있어서
     * cart 는 System.out.println(cart)에선 안 보인다.
     *******************************************************************/


    @ManyToOne // 여러개의 장바구니 항목(cartItem)이 하나의 상품(product)를 참조
    @JoinColumn(name = "product_pno")//product_pno 컬럼에 FK 설정
    private Product product;

    @ManyToOne //여러 개의 장바구니 항목(CartItem)이 하나의 Cart를 참조
    @JoinColumn(name = "cart_cno")//cart_cno 컬럼에 FK 설정
    private Cart cart;

    private int qty; //수량

    public void changeQty(int qty){
        this.qty = qty;
    }
}
