package org.zerock.mallapi.service.Product;

import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.Product.ProductDTO;

public interface ProductService {
    // 1. 단일 항목 조회 (GET)
    ProductDTO get(Long pno);
    // 2. 리스트 조회 (GET)
    PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO);
    // 3. 상품 등록 (POST)
    Long register(ProductDTO productDTO);
    // 4. 상품 수정 (PUT)
    void modify(ProductDTO productDTO);
    // 5-1. 논리 삭제 (SOFT DELETE)
    void softDelete(Long pno);
    // 5-2. DB 삭제 (HARD DELETE)
    void hardDelete(Long pno);
}
