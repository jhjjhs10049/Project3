package org.zerock.mallapi.domain.ShoppingCart;

import jakarta.persistence.*;
import lombok.*;

// Import Member class (adjust the package if Member is in a different package)
import org.zerock.mallapi.domain.Member.Member;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "owner") //owner 를 제외하고 출력(toString() 출력시 owner 제외)
@Table( // 인덱스를 사용한 이유 ? 검색 성능 향상(email로 장바구나 빠르게 조회)
        name = "tbl_cart", //인덱스 이름 idx_cart_email, 인덱스를 걸 컬럼의 이름 member_owner
        indexes = { @Index(name="idx_cart_email", columnList = "member_owner")})
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno;

    //@OneToOne 의 기본 로딩 전략은 즉시로딩 입니다.
    //@OneToOne 으로 설정하면 외래키 컬럼(member_owner)에 자동으로 유니크 제약조건이 붙는다.
    @OneToOne   //1:1 단방향 관계설정(Cart 가 Member 를 일방적으로 참조하는 단방향 관계, 그래서 Member 는 Cart와의 관계를 전혀 모른다.)
    // 'Member 는 Cart 와의 관계를 전혀 모른다' 라는 의미가 코드에서는 어떤 의미인가?
    // member 는 cart 를 참조하고 있지 않으므로 member.getCart() 같은 메서드가 없어서
    // Cart 에 접근할 수 없다 라는 뜻입니다.
    @JoinColumn(name = "member_owner") // 현재 테이블(Cart)에 member_owner 라는 외래키 생성하고 cno 라는 PK를 참조한다.
    private Member owner;

    /****************************************************************
     * @OneToOne 설정시 즉시로딩의 경우:
     * Cart를 조회하면 owner는 로딩된다
     * @ToString(exclude="owner")는 출력에만 영향을 줄뿐 owner을 로딩 합니다.
     * 즉, owner는 사용 가능하지만 System.out.println(cart)에선 안 보인다.
     * @OneToOne(fetch = FetchType.LAZY) 으로 설정하면, JPA는 Cart를 조회할 때
     * owner (즉, Member)를 즉시 DB에서 불러오지 않습니다.
     * 다만 cart.getOwner().getEmail())하는 시점에,
     * JPA가 DB에 추가 쿼리를 날려서 Member 데이터를 불러옵니다
     *******************************************************************/

}
