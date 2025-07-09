package org.zerock.mallapi.controller.Product;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.Product.ProductDTO;
import org.zerock.mallapi.service.Product.ProductService;
import org.zerock.mallapi.util.CustomFileUtil;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/products")
public class ProductController {

    private final CustomFileUtil fileUtil;
    private final ProductService productService;

    // 1. 단일 항목 조회 (GET)
    @GetMapping("/{pno}")   
    public ProductDTO get(@PathVariable(name = "pno") Long pno){
        return productService.get(pno);
    }

    // 2. 리스트 조회 (GET)
    @GetMapping("/list")
    public PageResponseDTO<ProductDTO> list(PageRequestDTO pageRequestDTO){

        log.info("list............" + pageRequestDTO);

        return productService.getList(pageRequestDTO);
    }
    // 3. 상품 등록 (POST)
    @PostMapping("/")
    public Map<String, Long> register(ProductDTO productDTO){

        log.info("register : " + productDTO);

        List<MultipartFile> files = productDTO.getFiles();

        //파일을 저장하고 저장된 파일의 이름을 리턴 받는다.
        List<String> uploadFileNames = fileUtil.saveFiles(files);

        productDTO.setUploadFileNames(uploadFileNames);

        log.info(uploadFileNames);

        //서비스 호출
        Long pno = productService.register(productDTO);

        //return Map.of("RESULT", "SUCCESS");

        //DB에 데이터를 넣고나서 모달창이 조금더 오래 보이도록 하자
        try{
            Thread.sleep(1000); // 1초간 sleep...
        }catch (InterruptedException e){
            e.printStackTrace();
        }


        return Map.of("result", pno);
    }

    // 4. 상품 수정 (PUT)
    @PutMapping("/{pno}")
    public Map<String , String> modify(@PathVariable(name="pno") Long pno, ProductDTO productDTO){
        log.info("modify : " + productDTO);
        
        //기존 상품의 정보 얻어오기
        ProductDTO oldProductDTO = productService.get(pno);

        //기존의 파일들 (DB에 존재하는 파일들 - 수정 과정에서 삭제되었을 수 있음)
        List<String> oldFileNames = oldProductDTO.getUploadFileNames();

        // 수정할 상품의 pno 를 DTO 에 설정
        productDTO.setPno(pno);

        // 새로 업로드 해야 하는 파일들
        List<MultipartFile> files = productDTO.getFiles();

        //새로 업로드 되어서 만들어진 파일 이름들 : saveFiles() 에서 실제 업로드 수행
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);

        //화면에서 변화 없이 계속 유지된 파일들(지워지지 않고 계속 유지된 파일들)
        //사용자가 화면에서 지우지 않고 그대로 둔 파일들
        //화면에 그림 A,B,C 가 있다고 가정
        //사용자가 C 그림을 지웠다면
        //화면에서 현재 유지되고 있는 파일은 A,B 이다.
        List<String> uploadedFileNames = productDTO.getUploadFileNames();

        //유지된 파일들 + 새로 업로드된 파일 이름들이 저장해야 하는 파일 목록이 된다.
        if(currentUploadFileNames != null && currentUploadFileNames.size() > 0){
            uploadedFileNames.addAll(currentUploadFileNames);
        }
        //수정 작업
        productService.modify(productDTO);

        if(oldFileNames != null && oldFileNames.size() > 0){
            //지워야 하는 파일 목록 찾기
            //예전 파일들 중에서 지워져야 하는 파일이름들
            List<String> removeFiles = oldFileNames
                    .stream()//uploadedFileNames 에 없는 fileName 만 필터링 하겠다.
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1)
                    .collect(Collectors.toList());

            //실제 파일 삭제
            fileUtil.deleteFiles(removeFiles);//지워져야 하는 파일들 removeFiles
        }
        return Map.of("RESULT", "SUCCESS");
    }
    // 5-1. 논리 삭제 (SOFT DELETE)
    @DeleteMapping("/soft/{pno}")
    public Map<String, String> softDelete(@PathVariable("pno") Long pno){
        
        // get 메소드로 기존의 사진 리스트를 oldFileNames 에 저장
        List<String> oldFileNames = productService.get(pno).getUploadFileNames();

        //DB 에서 지우기 (실제로 지워지는게 아니고 DB의 del_flag 의 값을 0에서 1로 변경한다.)
        productService.softDelete(pno);

        //서버에 있는 upload 폴더안에 파일 삭제(실제 서버에서 삭제 된다.)
        fileUtil.deleteFiles(oldFileNames);

        return Map.of("RESULT", "SUCCESS");
    }
    // 5-2. DB 삭제 (HARD DELETE)
    @DeleteMapping("/hard/{pno}")
    public Map<String, String> hardDelete(@PathVariable("pno") Long pno){
        
        // get 메소드로 기존의 사진 리스트를 oldFileNames 에 저장
        List<String> oldFileNames = productService.get(pno).getUploadFileNames();

        //DB 에서 지우기 (실제로 지움)
        productService.hardDelete(pno);

        //서버에 있는 upload 폴더안에 파일 삭제(실제 서버에서 삭제 된다.)
        fileUtil.deleteFiles(oldFileNames);

        return Map.of("RESULT", "SUCCESS");
    }

    // 6. 상품 이미지를 웹브라우저에서 볼 수 있게 해주는 API
    // src 태그에서 GET방식으로 호출되는데 /view/{fileName} 와 URL이 매핑되기에 viewFileGET() 메소드가 호출된다.
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){

        return fileUtil.getFile(fileName);
    }


}
