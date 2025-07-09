package org.zerock.mallapi.controller.Todo;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.Todo.TodoDTO;
import org.zerock.mallapi.service.Todo.TodoService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/todo")
public class TodoController {

    private final TodoService service;

    // 1. 단일 항목 조회 (GET)
    @GetMapping("/{tno}")
    // (@PathVariable(name = "tno") Long tno) 클라이언트가 보낸 URL 경로에서 tno 값을 추출하는 역할 (요청 역할)
    //  TodoDTO DB에서 받아오는 값을 담는 DTO로, 서비스가 반환한 값을 클라이언트에 응답하는 역할 (응답 역할)
    public TodoDTO get(@PathVariable(name = "tno") Long tno){
        log.info("tno: " + tno);
        // service.get(tno): 서비스에 tno 전달 → DB 조회 요청 (요청 역할)
        // return: 서비스가 반환한 TodoDTO를 클라이언트에 응답 (응답 역할)
        return service.get(tno); 
    }

    // 2. 리스트 조회 (GET)
    @GetMapping("/list")
    // pageRequestDTO 에 url의 쿼리스트링을 매핑해준다 (요청 역할)
    // PageResponseDTO DB에서 받아오는 값을 담는 DTO로, 서비스가 반환한 값을 클라이언트에 응답하는 역할 (응답 역할)
    public PageResponseDTO<TodoDTO> list (PageRequestDTO pageRequestDTO){
        log.info(pageRequestDTO);
        // service.list(pageRequestDTO): 서비스에 pageRequestDTO 전달 → DB 조회 요청 (요청 역할)
        // return: 서비스가 반환한 PageResponseDTO를 클라이언트에 응답 (응답 역할)
        return service.list(pageRequestDTO); 
    }

    // 3. 항목 추가 (POST)
    @PostMapping("/")
    // @RequestBody: 클라이언트가 보낸 JSON 형태의 요청 본문을 TodoDTO 객체로 변환 (요청 역할)
    // Map<String, Long>: 서비스가 반환한 tno 값을 클라이언트에 응답하는 역할 (응답 역할)
    public Map<String, Long> register(@RequestBody TodoDTO todoDTO){

        log.info("TodoDTO: " + todoDTO);

        // 호출하면서 todoDTO를 서비스에 전달(요청 역할)
        // 호출이 끝나면 tno 값을 서비스로부터 받음(응답 역할)
        Long tno = service.register(todoDTO);
        
        // 이 Map은 클라이언트에 응답으로 전달됨 (응답 역할)
        return Map.of("TNO", tno);
    }

    // 4. 항목 수정 (PUT)
    @PutMapping("/{tno}")
    // service에서 오는것은 없고, Map<String, String> 형태로 응답을 보내줌 (응답 역할)
    public Map<String, String> modify(
            // (@PathVariable(name = "tno") Long tno) 클라이언트가 보낸 URL 경로에서 tno 값을 추출하는 역할 (요청 역할)
            @PathVariable(name="tno") Long tno,
            // 클라이언트에서 json 형태로 요청 본문을 받아 TodoDTO 객체로 변환 (요청 역할)
            @RequestBody TodoDTO todoDTO) {
        
        // todoDTO에 tno 값을 설정 (클라이언트 url에서 추출한 tno)
        todoDTO.setTno(tno);

        log.info("Modify: " + todoDTO);
        
        // 서비스에 todoDTO 전달 → DB 수정 요청 (요청 역할)
        service.modify(todoDTO);
        
        // Map<String, String> 형태로 응답을 보내줌 (응답 역할)
        return Map.of("RESULT", "SUCCESS");
    }

    // 5. 항목 삭제 (DELETE)
    @DeleteMapping("/{tno}")
    public Map<String, String> remove( @PathVariable(name="tno") Long tno ){

        log.info("Remove:  " + tno);

        service.remove(tno);

        return Map.of("RESULT", "SUCCESS");
    }




}
