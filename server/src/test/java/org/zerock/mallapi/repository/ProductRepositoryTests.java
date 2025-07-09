package org.zerock.mallapi.repository;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Product.Product;
import org.zerock.mallapi.repository.Product.ProductRepository;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {

    @Autowired
    ProductRepository productRespository;

    @Test
    public void testInsert(){   // 하나의 Product에 2개의 첨부파일이 있는 상태로 엔티티를 생성
        for(int i =0; i<10; i++){//10개의 상품을 만들고 1개의 상품당 2개의 이미지 파일을 가진다.
            Product product = Product.builder()
                    .pname("상품" + i)
                    .price(100*i)
                    .pdesc("상품설명 " + i)
                    .build();

            //2개의 이미지 파일 추가
            product.addImageString(UUID.randomUUID().toString() + "_" + "IMAGE1.jpg");
            product.addImageString(UUID.randomUUID().toString() + "_" + "IMAGE2.jpg");

            productRespository.save(product);

            log.info("-------------------");
        }
    }

    @Transactional
    @Test
    public void testRead(){

        Long pno = 1L;

        Optional<Product> result = productRespository.findById(pno);
        Product product = result.orElseThrow();

        log.info(product);
        log.info(product.getImageList());
    }

    //testRead() 와 다르게 @Transactional 이 없어도 두개의 테이블을 처리할수 있다.
    //selectOne() 에 @EntityGraph 가 있어서 테이블들을 조인 처리해서 한번에 로딩 하였다.
    @Test
    public void testRead2(){

        Long pno = 1L;

        Optional<Product> result = productRespository.selectOne(pno);

        Product product = result.orElseThrow();

        log.info(product);
        log.info(product.getImageList());
    }


    //@Transactional 이 선언된 테스트는 끝나면 자동으로 롤백 된다.
    //하지만 @Commit 을 붙이면 롤백 대신 커밋 한다.
    //실제 운영 코드에서는 사용하지 않으며, 테스트 코드 전용 이다.
    //@Commit 은 테스트용 데이터가 실제 DB에 반영 되므로 주의해서 사용해야 한다.
    @Commit
    @Transactional
    @Test
    public void testDelete(){
        Long pno = 2L;
        //데이터 삭제시 실제 삭제가 아닌 delFlag의 값을 true로 변경해서 삭제된 상품으로 표시한다.
        productRespository.updateToDelete(pno, true);
    }

    @Test
    public void testUpdate(){
        Long pno = 10L;

        Product product = productRespository.selectOne(pno).get();

        product.changeName("10번 상품");
        product.changeDesc("10번 상품 설명 입니다.");
        product.changePrice(5000);

        //첨부파일 수정
        product.clearList();

        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE1.jpg");
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE2.jpg");
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE3.jpg");

        productRespository.save(product);
    }

    @Test
    public void testList(){
        //left join 처리된 쿼리가 실행
        //Product 와 ProductList가 배열로 만들어진 것을 확인
        //대표 이미지 ord=0 인 이미지만 불러왔다.
        Pageable pageable = PageRequest.of(0,10, Sort.by("pno").descending());

        Page<Object[]> result = productRespository.selectList(pageable);

        result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));
    }


}
