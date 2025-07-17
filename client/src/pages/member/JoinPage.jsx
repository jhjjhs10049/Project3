import BasicMenu from "../../components/menus/BasicMenu";
import JoinComponent from "../../components/member/JoinComponent";

const JoinPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full">
      <BasicMenu />

      <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
        <div className="text-2xl">
          {/* Join Page */}
          <JoinComponent />
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
