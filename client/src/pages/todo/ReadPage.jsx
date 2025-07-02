import { useParams } from "react-router-dom";
import ReadComponent from "../../components/todo/ReadComponent";

const ReadPage = () => {
  // useParams 훅을 사용하여 URL의 파라미터값을 읽어온다음 tno 변수에 저장
  // 예: /todo/123 → tno = 123
  const { tno } = useParams();

  return (
    <div className="font-extrabold w-full bg-white mt-6">
      <div className="text-2xl">Todo Read Page Component {tno}</div>
      
      {/* ReadComponent에 tno를 props로 전달 */}
      <ReadComponent tno={tno}></ReadComponent>
    </div>
  );
};

export default ReadPage;
