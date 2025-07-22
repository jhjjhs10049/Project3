package org.zerock.mallapi.repository.ShoppingCart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.ShoppingCart.CartItem;
import org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * inner join : 조인의 조건에 만족하는 데이터만 출력
     * left join :  왼쪽은 데이터가 항상유지, 오른쪽은 조건을 만족하면 해당 데이터 출력
     *              단, 조건을 만족하지 않는 경우는 null 로 표시
     *
     * 쿼리 분석 : ci 와 mc 의 교집합, ci.cart = mc 인 경우에만 내부조인(즉 ci와 mc는 필수)
     * CartItem ci inner join Cart mc on ci.cart = mc
     *
     * 쿼리 분석 : 위 결과를 기준은로 왼쪽(ci) 데이터는 항상 유지
     * 오른쪽(p)는 ci.product = p 조건에 매칭되는 값이 있다면 함께 가져오고
     * 없다면 p에 해당하는 값은 null 로 반환합니다.
     * left join Product p on ci.product = p
     *
     * 쿼리 분석 : 위 결과를 기준은로 왼쪽(p) 데이터는 항상 유지
     * 오른쪽(pi) 에 데이터가 있으면 그 데이터가 함께 나오고
     * 없다면 pi는 null 로 채워지고 결과에는 포함된다.
     * p가 null 이면 (ci.product 가 매핑이 안 된 경우) 해당 행은 제외됨(pi와 조인이 안됨)
     * left join p.imageList pi
     */
    @Query("select " +
            " new org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO(ci.cino,  ci.qty,  p.pno, p.pname, p.price , pi.fileName )  " +
            " from " +
            "   CartItem ci inner join Cart mc on ci.cart = mc " +
            "   left join Product p on ci.product = p " +
            "   left join p.imageList pi" +
            " where " +
            "   mc.owner.email = :email and pi.ord = 0 " +
            " order by ci desc ")
    public List<CartItemListDTO> getItemsOfCartDTOByEmail(@Param("email") String email);
    //getItemsOfCartDTOByEmail : 이메일로 장바구니 아이템 목록을 가져온다.

    @Query("select" +
            " ci "+
            " from " +
            "   CartItem ci inner join Cart c on ci.cart = c " +
            " where " +
            "   c.owner.email = :email and ci.product.pno = :pno")
    public CartItem getItemOfPno(@Param("email") String email, @Param("pno") Long pno );
    //getItemOfPno : 이메일과 상품번호로 CartItem 을 받아온다.

    @Query("select " +
            "  c.cno " +
            "from " +
            "  Cart c inner join CartItem ci on ci.cart = c " +
            " where " +
            "  ci.cino = :cino")
    public Long getCartFromItem( @Param("cino") Long cino);
    //getCartFromItem : CartItem 번호로 해당 아이템이 담긴 장바구니(cart)를 조회해서
    //cart 에 해당 하는 카트 번호를 찾는다.

    @Query("select new org.zerock.mallapi.dto.ShoppingCart.CartItemListDTO(ci.cino,  ci.qty,  p.pno, p.pname, p.price , pi.fileName )  " +
            " from " +
            "   CartItem ci inner join Cart mc on ci.cart = mc " +
            "   left join Product p on ci.product = p " +
            "   left join p.imageList pi" +
            " where " +
            "  mc.cno = :cno and pi.ord = 0 " +
            " order by ci desc ")
    public List<CartItemListDTO> getItemsOfCartDTOByCart(@Param("cno") Long cno);
    // 카트번호로 장바구니에 담긴 모든 아이템 목록을 가져온다.
}
