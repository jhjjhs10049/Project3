package org.zerock.mallapi.service;

import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.TodoDTO;

public interface TodoService {

    // 왜 컨트롤러에서 정의한 타입들(ex: Long, PageRequestDTO) 서비스에서 재선언 하는가?
    // Controller와 Service는 서로 다른 역할을 수행하기 때문
    // 또한 의존성 제거, 가독성 과 유지보수 용의성을 이유로 새로 선언하는것임

    // TodoServiceImpl 참조

    // 1. 단일 항목 조회 (GET)
    // Long tno는 요청 역할로 tno를 Long으로 재선언후 Repository에 전달함 (요청 역할)
    // TodoDTO는 응답 역할로 Repository에서 받아오는 값을 담는 DTO로, 컨트롤러로 보내줌 (응답 역할)
    TodoDTO get(Long tno); 

    // 2. 리스트 조회 (GET)
    // PageRequestDTO pageRequestDTO는 요청 역할로 pageRequestDTO(쿼리스트링)를 PageRequestDTO로 재선언후 Repository에 전달함 (요청 역할)
    // PageResponseDTO<TodoDTO>는 응답 역할로 Repository에서 받아오는 TodoDTO값을 담는 DTO로, PageResponseDTO로 맞추어 컨트롤러로 보내줌 (응답 역할)
    PageResponseDTO<TodoDTO> list (PageRequestDTO pageRequestDTO); 
    
    // 3. 항목 추가 (POST)
    // TodoDTO todoDTO는 요청 역할로 클라이언트가 보낸 todoDTO(Json->TodoDTO)를 TodoDTO로 재선언후 Repository에 전달함 (요청 역할)
    // Long 는 응답 역할로 Repository에서 받아오는 tno값을 받아서 컨트롤러로 보내줌 (응답 역할)
    Long register(TodoDTO todoDTO);
    
    // 4. 항목 수정 (PUT)
    // TodoDTO todoDTO는 요청 역할로 클라이언트가 보낸 todoDTO(Json->TodoDTO)를 TodoDTO로 재선언후 Repository에 전달함 (요청 역할)
    void modify(TodoDTO todoDTO);

    // 5. 항목 삭제 (DELETE)
    // Long tno는 요청 역할로 클라이언트가 보낸 tno(Long)를 Long으로 재선언후 Repository에 전달함 (요청 역할)
    void remove(Long tno);
}
