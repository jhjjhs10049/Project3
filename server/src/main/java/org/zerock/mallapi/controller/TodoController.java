package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.TodoDTO;
import org.zerock.mallapi.service.TodoService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/todo")
public class TodoController {

    private final TodoService service;

    // 1. 단일 항목 조회 (GET)
    @GetMapping("/{tno}")
    public TodoDTO get(@PathVariable(name = "tno") Long tno){
        return service.get(tno); // ← 여기서 TodoService 호출
    }

    // 2. 리스트 조회 (GET with params)
    @GetMapping("/list")
    // PageResponseDTO는 페이지네이션을 정의해주고, TodoDTO를 리스트화하여 내용을 저장함
    // PageRequestDTO는 url의 쿼리스트링을 받아서 pageRequestDTO로 변환하여 저장함
    // 마지막에는 PageResponseDTO에서 저장된 데이터와함께 pageRequestDTO에 저장된 쿼리스트링을 서비스단으로 전달함
    public PageResponseDTO<TodoDTO> list (PageRequestDTO pageRequestDTO){
        log.info(pageRequestDTO);
        return service.list(pageRequestDTO); // ← 여기서 TodoService 호출
    }

    @PostMapping("/")
    public Map<String, Long> register(@RequestBody TodoDTO todoDTO){

        log.info("TodoDTO: " + todoDTO);

        Long tno = service.register(todoDTO);

        return Map.of("TNO", tno);
    }

    @PutMapping("/{tno}")
    public Map<String, String> modify(
            @PathVariable(name="tno") Long tno,
            // json 형태로 요청 본문에 TodoDTO를 받음
            @RequestBody TodoDTO todoDTO) {

        todoDTO.setTno(tno);

        log.info("Modify: " + todoDTO);

        service.modify(todoDTO);

        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{tno}")
    public Map<String, String> remove( @PathVariable(name="tno") Long tno ){

        log.info("Remove:  " + tno);

        service.remove(tno);

        return Map.of("RESULT", "SUCCESS");
    }




}
