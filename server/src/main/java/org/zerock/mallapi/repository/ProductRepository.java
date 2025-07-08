package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Product;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 역할분리 유지보수등을 이유로 DB와 직접 연결되는 코드들은 repository 패키지에 작성한다.

    // N+1 문제
    // SELECT * FROM product; 로 전체 상품을 가져오고 (반드시 해야하는 1번)
    // SELECT * FROM product_image WHERE product_id = 1;
    // SELECT * FROM product_image WHERE product_id = 2; ....
    // imageList를 가져오려면 product 의 pno 개수만큼의 쿼리가 실행된다. 그렇기에 N+1 문제라고 한다.
    // 지연로딩시 생기는 문제로 이런경우에만은 즉시로딩이 필요하다. (지연로딩이 통상적이다.)
    // 즉시로딩은 연관된 데이터를 한번에 가져오는방식으로 지금과같이 어짜피 다 가져와야하는 상황에는 오히려 좋을수도 있다.

    // 상품 1개 조회	쿼리 1번 (상품) + 1번 (이미지) = 2번	쿼리 1번만 (상품 + 이미지 함께)
    // 상품 N개 조회	쿼리 1번 (상품 전체) + N번 (이미지) = N+1	쿼리 1번 (JOIN으로 전체 조회)
    

    //@EntityGraph 를 사용한 즉시로딩
    //페이징 지원을 하지 않는다.
    //전체 imageList 를 가져 온다.
    @EntityGraph(attributePaths = "imageList")
    @Query("select p from Product p where p.pno = :pno")
    Optional<Product> selectOne(@Param("pno") Long pno);

    //JPQL left join 방식으로 조회
    //ord = 0인 대표 이미지 하나만 가져온다.
    //페이징 지원을 한다.
    //만일 imageList 전체를 조회하고 싶고, 연관된 모든 이미지를 Product 안에서 사용하려 한다면,
    //그때는 @EntityGraph 또는 join fetch를 사용하는게 안전 합니다.
            // p, pi 는 각각 Product, ProductImage 엔티티를 의미하고 조인으로 즉시로딩 방식 사용
    @Query("select p, pi from Product p left join p.imageList pi " +
            // 페이지 이미지의 경우 ord = 0인 대표 이미지만 가져오고, delFlag가 false인 상품만 가져온다.(삭제되지않음)
            "where pi.ord = 0 and p.delFlag = false")
    // Object[0]에는 Product 엔티티가, Object[1]에는 ProductImage 엔티티가 담겨있다.
    Page<Object[]> selectList(Pageable pageable);

    //@Query는 SELECT 쿼리를 위한 것이지만
    //데이터를 변경하는 JPQL을 사용하려면 @Modifying을 반드시 함께 붙여야 작동 합니다.
    // 특정 상품(pno)의 삭제 여부(delFlag)를 true 또는 false로 변경할 수 있는 메서드를 선언함
    @Modifying
    @Query("update Product p set p.delFlag = :flag where p.pno = :pno")
    void updateToDelete(@Param("pno") Long pno, @Param("flag") boolean flag);
}

// selectOne: 단일 상품 조회 시, 상품과 이미지 리스트를 한 번에 즉시로딩해서 추가 쿼리 없이 가져오기
// selectList: 상품 여러 개 조회 시, 상품과 대표 이미지(섬네일)만 조인해서 한꺼번에 효율적으로 가져오기
// updateToDelete: 상품 삭제 여부를 논리적으로 바꾸기 위해 DB의 delFlag 값을 업데이트하는 메서드
