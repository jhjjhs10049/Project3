import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/todo/ModifyComponent";

const ModifyPage = () => {
  // useParams 훅을 사용하여 URL의 파라미터값을 읽어온다음 tno 변수에 저장
  // 예: /todo/123 → tno = 123
  const { tno } = useParams();

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">Todo Modify Page</div>

      {/* ModifyComponent에 tno를 props로 전달 */}
      <ModifyComponent tno={tno} />
    </div>
  );
};

export default ModifyPage;
