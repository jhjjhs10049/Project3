import { useSearchParams } from "react-router-dom";
import ListComponent from "../../components/todo/ListComponent";


const ListPage = () => {
  // /todo/123 → Path Parameter (URL 파라미터)
  // 예: useParams()로 읽음 → tno = 123
  // ?page=2&size=10 → Query String (쿼리 스트링)
  // 예: useSearchParams()로 읽음 → page = 2, size = 10

  // useSearchParams 훅을 사용하여 URL의 URL의 쿼리스트링(?page=2&size=5)을 읽어옴
  const [queryParams] = useSearchParams();

  // page나 size가 존재하면 parseInt()로 숫자로 변환
  // 존재하지 않으면 기본값 1과 10을 사용
  const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
  const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10;

  // ListComponent 호출
  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
        Todo List Page Component {page} --- {size}
      </div>
      <ListComponent />
    </div>
  );
};

export default ListPage;
