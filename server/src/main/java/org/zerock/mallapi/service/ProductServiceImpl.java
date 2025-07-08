package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.ProductImage;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.repository.ProductRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService{

    private final ProductRepository productRepository; 

    // 1. 단일 항목 조회 (GET)
    @Override
    public ProductDTO get(Long pno) {
        // repository에서 selectOne() 메서드를 호출하여 상품을 조회
        Optional<Product> result = productRepository.selectOne(pno);
        // 조회된 상품이 없으면 예외를 발생시킨다.
        Product product = result.orElseThrow();
        // 조회된 상품 entity를 DTO로 변환
        ProductDTO productDTO = entityToDTO(product);
        // 서비스단으로 productDTO를 반환 
        return productDTO;
    }
    // 2. 리스트 조회 (GET)
    @Override
    // 클라이언트로부터 PageRequestDTO를 받아서 상품 목록을 조회하는 메서드
    public PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO) {

        log.info("getList....................");
        // pageRequestDTO에서 페이지 정보와 정렬 정보를 추출하여 pageable 객체를 생성
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() -1,//페이지 시작번호가 0 부터 시작하므로
                pageRequestDTO.getSize(),
                Sort.by("pno").descending());

        // productRepository의 selectList() 메서드를 호출하여 상품 목록을 조회
        Page<Object[]> result = productRepository.selectList(pageable);

        // 조회된 결과에서 총 상품 개수를 가져온다.
        long totalCount = result.getTotalElements();

        // result 객체에서 상품과 이미지 정보를 추출하여 ProductDTO 리스트로 변환
        List<ProductDTO> dtoList = result.get().map(arr ->{

            Product product = (Product) arr[0];
            ProductImage productImage = (ProductImage)  arr[1];

            ProductDTO productDTO = ProductDTO.builder()
                    .pno(product.getPno())
                    .pname(product.getPname())
                    .pdesc(product.getPdesc())
                    .price(product.getPrice())
                    .build();

            String imageStr = productImage.getFileName();
            productDTO.setUploadFileNames(List.of(imageStr));

            return productDTO;
            // 변환된 productDTO를 collect하여 List<ProductDTO>로 반환
        }).collect(Collectors.toList());

        // PageResponseDTO<ProductDTO>를 생성하여 반환
        // 지금까지만든 List<ProductDTO>, dtoList, totalCount, pageRequestDTO를 사용하여 값을 업데이트 하여 클라이언트에게 반환
        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    // 3. 상품 등록 (POST)
    @Override
    public Long register(ProductDTO productDTO) {
        // ProductDTO를 Product 엔티티로 변환
        Product product = dtoToEntity(productDTO);
        // product 엔티티를 저장하고, 저장된 엔티티의 pno를 반환
        Product result = productRepository.save(product);
        return result.getPno();
    }
    // ProductDTO를 Product 엔티티로 변환하는 메서드
    private Product dtoToEntity(ProductDTO productDTO){
        Product product = Product.builder()
                .pno(productDTO.getPno())
                .pname(productDTO.getPname())
                .pdesc(productDTO.getPdesc())
                .price(productDTO.getPrice())
                .build();

        //업로드 처리가 끝난 파일들의 이름 리스트
        List<String> uploadFileNames = productDTO.getUploadFileNames();

        if(uploadFileNames == null){
            return product;
        }

        // 업로드된 파일들을 uploadNames 객체로 변환하여 product 엔티티에 추가
        uploadFileNames.stream().forEach(uploadNames -> {
            product.addImageString(uploadNames);
        });
        
        return product;
    }
    
    // 4. 상품 수정 (PUT)
    @Override
    public void modify(ProductDTO productDTO) {
        //step1 read
        Optional<Product> result = productRepository.findById(productDTO.getPno());

        Product product = result.orElseThrow();

        //change pname, pdesc, price
        product.changeName(productDTO.getPname());
        product.changeDesc(productDTO.getPdesc());
        product.changePrice(productDTO.getPrice());

        //리스트에 있는 이미지 들을 다 비운다.
        product.clearList();

        List<String> uploadFileNames = productDTO.getUploadFileNames();

        if(uploadFileNames != null && uploadFileNames.size() > 0){
            uploadFileNames.stream().forEach(uploadName -> {
                product.addImageString(uploadName);
            });
        }

        productRepository.save(product);
    }

    // 5-1. 논리 삭제 (SOFT DELETE)
    @Override
    public void softDelete(Long pno) {
        productRepository.updateToDelete(pno, true);
    }

    // 5-2. DB 삭제 (HARD DELETE)
    @Override
    public void hardDelete(Long pno) {
        productRepository.deleteById(pno);
    }

    // 6. Product 엔티티를 ProductDTO로 변환하는 메서드 (1. GET 에서 사용됨)
    private ProductDTO entityToDTO(Product product){
        ProductDTO productDTO = ProductDTO.builder()
                .pno(product.getPno())
                .pname(product.getPname())
                .pdesc(product.getPdesc())
                .price(product.getPrice())
                .build();

        // product 엔티티에서 이미지 리스트를 가져와서 imageList에 대입
        List<ProductImage> imageList = product.getImageList();
        if(imageList == null || imageList.size() == 0) {
            return productDTO;
        }

        // 이미지 리스트에서 파일 이름만 추출하여 fileNameList에 대입
        List<String> fileNameList = imageList.stream().map(productImage ->
                productImage.getFileName()).toList();

        // 추출한 파일 이름 리스트를 productDTO에 설정
        productDTO.setUploadFileNames(fileNameList);

        return productDTO;
    }
}
