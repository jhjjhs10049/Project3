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

    //@EntityGraph 를 사용한 즉시로딩
    //페이징 지원을 하지 않는다.
    //전체 imageList 를 가져 온다.
    @EntityGraph(attributePaths = "imageList")
    @Query("select p from Product p where p.pno = :pno")
    Optional<Product> selectOne(@Param("pno") Long pno);

    //@Query는 SELECT 쿼리를 위한 것이지만
    //데이터를 변경하는 JPQL을 사용하려면 @Modifying을 반드시 함께 붙여야 작동 합니다.
    @Modifying
    @Query("update Product p set p.delFlag = :flag where p.pno = :pno")
    void updateToDelete(@Param("pno") Long pno, @Param("flag") boolean flag);

    //JPQL left join 방식으로 조회
    //ord = 0인 대표 이미지 하나만 가져온다.
    //페이징 지원을 한다.
    //만일 imageList 전체를 조회하고 싶고, 연관된 모든 이미지를 Product 안에서 사용하려 한다면,
    //그때는 @EntityGraph 또는 join fetch를 사용하는게 안전 합니다.
    @Query("select p, pi from Product p left join p.imageList pi " +
            "where pi.ord = 0 and p.delFlag = false")
    Page<Object[]> selectList(Pageable pageable);
}
