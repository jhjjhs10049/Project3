package org.zerock.mallapi.service;

import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.TodoDTO;

public interface TodoService {

    // 1. 단일 항목 조회 (GET)
    TodoDTO get(Long tno); // ← 인터페이스 정의 impl로

    // 2. 리스트 조회 (GET with params)
    PageResponseDTO<TodoDTO> list (PageRequestDTO pageRequestDTO);

    Long register(TodoDTO todoDTO);

    void modify(TodoDTO todoDTO);

    void remove(Long tno);
}
