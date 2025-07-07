package org.zerock.mallapi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.Todo;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.TodoDTO;
import org.zerock.mallapi.repository.TodoRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final ModelMapper modelMapper;

    private final TodoRepository todoRepository;

    // 1. 단일 항목 조회 (GET)
    @Override
    public TodoDTO get(Long tno) {

        Optional<Todo> result = todoRepository.findById(tno); // ← todoRepository에서 findById() (기본)메서드 사용

        Todo todo = result.orElseThrow();

        // ModelMapper를 사용하여 Todo라는 엔티티를 TodoDTO라는 DTO로 변환
        // ModelMapper는 객체 간의 필드 매핑을 자동으로 처리해줌 (dto와 entity 간의 변환을 쉽게 해줌)
        TodoDTO dto = modelMapper.map(todo, TodoDTO.class);

        return dto;
    }

    // 2. 리스트 조회 (GET)
    @Override
    public PageResponseDTO<TodoDTO> list(PageRequestDTO pageRequestDTO) {

        // PageRequest를 이용해서 pageable 객체를 생성
        Pageable pageable = PageRequest.of(
                // 실제로는 0부터 시작하는 페이지 번호를 위해 -1을 해줌
                pageRequestDTO.getPage() -1,
                pageRequestDTO.getSize(),
                Sort.by("tno").descending());
        // todoRepository.findAll(pageable)를 호출해 DB에서 페이징 및 정렬 조건에 맞는 Todo 엔티티 데이터를 조회
        Page<Todo> result = todoRepository.findAll(pageable);
        
        // Page<Todo>를 List<TodoDTO>로 변환
        List<TodoDTO> dtoList = result.getContent().stream()
                // modelMapper를 사용하여 Todo라는 엔티티를 TodoDTO라는 DTO로 변환
                .map(todo -> modelMapper.map(todo, TodoDTO.class))
                // collect(Collectors.toList())를 사용하여 스트림을 List로 변환
                .collect(Collectors.toList());

        // 조건에 맞는 모든 Todo 개수를 가져옴 이 값은 페이징 UI에서 사용됨
        long totalCount = result.getTotalElements();

        // responseDTO를 생성하여 dtoList, pageRequestDTO, totalCount를 담아 반환
        PageResponseDTO<TodoDTO> responseDTO = PageResponseDTO.<TodoDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

    // 3. 항목 추가 (POST)
    @Override
    public Long register(TodoDTO todoDTO) {

        log.info("..........");
        // modelMapper를 사용하여 TodoDTO를 Todo 엔티티로 변환
        Todo todo = modelMapper.map(todoDTO, Todo.class);
        // 변환된 엔티티를 todoRepository를 통해 DB에 저장하고, 저장된 결과를 savedTodo로 받음
        Todo savedTodo = todoRepository.save(todo);
        
        // Long 타입으로 반환되며, 저장된 todo의 tno 값을 반환

        return savedTodo.getTno();
    }
        // 왜 tno 1개를 반환할때는 DTO를 사용하지 않는가?
        // Todo 엔티티는 tno 값을 가지고 있기 때문에, Todo 엔티티에서 직접 tno 값을 가져와 반환 
        //(즉 값1개만 필요할때는 get메서드를 사용하여 바로꺼내쓸수있음)
        // 그럼 DTO는 왜쓰는가?
        // TodoDTO는 여러 필드를 포함하고 있어, 전체 정보를 필요로 할 때 사용

    // 4. 항목 수정 (PUT)
    @Override
    public void modify(TodoDTO todoDTO) {
        // todoDTO에서 tno 값을 사용하여 해당 Todo 엔티티를 조회 (요청 역할)
        // Optional<Todo>를 result라는 entity로 해당되는 tno의 Todo 엔티티를 가져옴 (응답 역할)
        // todoDTO는 필요한 Tno를 알려주는 신호역할만 함
        Optional<Todo> result = todoRepository.findById(todoDTO.getTno());
        
        // Optional<Todo>에서 값을 꺼내 Todo라는 entity 객체로 변환
        // orElseThrow()를 사용하여 값이 없을 경우 예외를 발생시
        Todo todo = result.orElseThrow();
        
        todo.changeTitle(todoDTO.getTitle());
        todo.changeDuDate(todoDTO.getDueDate());
        todo.changeComplete(todoDTO.isComplete());

        todoRepository.save(todo);
    }

    // 5. 항목 삭제 (DELETE)
    @Override
    public void remove(Long tno) {
        todoRepository.deleteById(tno);
    }
}
