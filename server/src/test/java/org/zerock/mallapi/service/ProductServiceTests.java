package org.zerock.mallapi.service;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.Product.ProductDTO;
import org.zerock.mallapi.service.Product.ProductService;

import java.util.List;
import java.util.UUID;

@SpringBootTest
@Log4j2
public class ProductServiceTests {

    @Autowired
    ProductService productService;

    @Test
    public void testList(){
        //.builder().build()를 해준 이유?
        //1 page, 10 size 즉 기본값이 세팅된 PageRequestDTO 객체를 생성한다.
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().build();

        PageResponseDTO<ProductDTO> result = productService.getList(pageRequestDTO);

        result.getDtoList().forEach(dto -> log.info(dto));
    }

    @Test
    public void testRegister(){
        ProductDTO productDTO = ProductDTO.builder()
                .pname("새로운 상품")
                .pdesc("신규 추가 상품입니다.")
                .price(1000)
                .build();

        //UUID가 있어야 한다.
        productDTO.setUploadFileNames(
            List.of(
                    UUID.randomUUID() + "_" + "Test1.jpg",
                    UUID.randomUUID() + "_" + "Test2.jpg")
        );

        productService.register(productDTO);
    }

    @Test
    public void testRead(){
        //실제 존재하는 번호로 테스트
        Long pno = 12L;

        ProductDTO productDTO = productService.get(pno);

        log.info(productDTO);
        log.info(productDTO.getUploadFileNames());
    }

}
