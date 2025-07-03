package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mallapi.domain.Todo;

// Todo 테이블을 가져오고, Id값으로 Long 타입을 사용
// JpaRepository를 상속받아 기본적인 CRUD 메서드를 제공
public interface TodoRepository extends JpaRepository<Todo, Long> {
}
