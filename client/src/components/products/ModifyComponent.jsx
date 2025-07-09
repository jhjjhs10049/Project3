import { useEffect, useRef, useState } from "react";
import { getOne, hardDelete, putOne, softDelete } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
  pno: 0,
  pname: "",
  pdesc: "",
  price: 0,
  delFlag: false,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ModifyComponent = ({ pno }) => {
  //결과 모달
  const [result, setResult] = useState(null);
  //이동용 함수
  const { moveToProductRead, moveToProductList } = useCustomMove();

  const [product, setProduct] = useState(initState);

  const [fetching, setFetching] = useState(false);

  /** 
        목적	            useState	                useRef
        값 저장	            렌더링 후 저장	            렌더링과 무관하게 유지
        값 업데이트 방식	setState 호출 → 렌더링됨	ref.current = ... 즉시 저장
        리렌더링 여부	    발생	                    발생하지 않음
        렌더 중 접근 가능	가능	                    읽을 수는 있으나 쓰려면 위험(렌더 중에 ref.current 사용은 피하는 게 안전해요. 렌더 외부(이펙트나 이벤트 핸들러)에서 접근하세요.)

    */
  const uploadRef = useRef(); //DOM에 접근하거나, 렌더와 관련 없는 정보를 저장할 때 useRef를 사용하세요.
  //값을 바꾸더라도 리렌더링이 일어나지 않으므로 성능 최적화에 도움 됩니다.
  //그러나 값이 UI에 표시되거나 동적으로 변해야 한다면 useState를 사용해야 합니다.

  useEffect(() => {
    setFetching(true); // FetchingModal 보이기

    getOne(pno).then((data) => {
      setProduct(data);
      setFetching(false); // FetchingModal 숨김
    });
  }, [pno]);

  const handleChangeProduct = (e) => {
    product[e.target.name] = e.target.value;

    setProduct({ ...product });
  };

  const deleteOldImages = (imageName) => {
    //filter를 사용해서 fileName !== imageName 조건에 맞는 요소들만 통과 시킨다.
    //예 : uploadFileNames 에 [a.jpg, b.jpg, c.jpg] 가 있다고 가정하자
    //     a.jpg가 매개변수로 넘어 온다고 가정 하면
    //     filter를 통해서 resultFileNames 에는 b.jpg 와 c.jpg가 저장 된다.
    const resultFileNames = product.uploadFileNames.filter(
      (fileName) => fileName !== imageName
    );

    product.uploadFileNames = resultFileNames;

    setProduct({ ...product });
  };
  const handleClickModify = () => {
    // 이미지 파일 검증: 기존 이미지가 하나도 없고 새로 업로드할 파일도 없으면 경고
    const files = uploadRef.current.files;
    const hasExistingImages =
      product.uploadFileNames && product.uploadFileNames.length > 0;
    const hasNewFiles = files && files.length > 0;

    if (!hasExistingImages && !hasNewFiles) {
      alert("최소 하나의 이미지가 필요합니다. 이미지를 업로드해주세요.");
      return;
    } // 수정 시 새로운 이미지 파일을 추가하는 부분은 기존의 신규 상품 등록과 동일하다. 그래서 코드도 같다.
    // 여기서 useRef()(여기서는 uploadRef)는 기존의 자바스크립트에서 document.getByElementById()와 유사한 역할을 한다
    const formData = new FormData(); // FormData() : 자바 스크립트에서 파일 업로드나 폼 데이터를 서버로 전송할때 사용하는 객체

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // 유저가 선택한 파일들을 FormData 에 append() 를 사용해서 넣어주고 있다.
    }

    //other data
    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price);
    formData.append("delFlag", product.delFlag); //"사용(false)" 이면 실제 삭제가 아닌 값만 바꾼다.

    for (let i = 0; i < product.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", product.uploadFileNames[i]);
    }

    //FetchingModal 을 보이게 true 로 설정
    setFetching(true);

    //putOne(pno, formData) : 책 예제 코드 인데 데이터는 정상적으로 처리 되지만 서버의 응답 코드가 Network 에 안보인다.
    //책 예제 처럼 서버의 응답 데이터 RESULT : SUCCESS 를 받으려면 아래처럼 코드를 변경해야 한다.
    putOne(pno, formData).then((data) => {
      // 수정 처리
      setResult("Modified");
      setFetching(false);
      console.log("서버 응답:", data); // 여기에 RESULT가 있는지 확인 RESULT : SUCCESS
    });
  };
  const [deleteType, setDeleteType] = useState("soft"); // 기본값: 소프트 삭제

  const handleChange = (e) => {
    setDeleteType(e.target.value); // 'soft' or 'hard'
  };

  // 삭제 버튼 클릭 시 호출되는 함수
  const handleClickDelete = () => {
    setFetching(true);

    const deleteAction =
      deleteType === "soft" ? softDelete(pno) : hardDelete(pno);

    deleteAction
      .then(() => {
        setResult(
          deleteType === "soft" ? "소프트 삭제 완료" : "하드 삭제 완료"
        );
      })
      .catch(() => {
        setResult("삭제 실패");
      })
      .finally(() => setFetching(false));
  };
  const closeModal = () => {
    if (result === "Modified") {
      moveToProductRead(pno); //조회 화면으로 이동
    } else if (result === "소프트 삭제 완료" || result === "하드 삭제 완료") {
      moveToProductList();
    }
  };

  return (
    <div className="p-4 w-full bg-white">
      <div className="border-2 border-sky-200 mt-10 m-2 p-4">
        Product Modify Component
        {fetching ? <FetchingModal /> : <></>}{" "}
        {/* fetching 의  true/false 에 의해 FetchingModal 을 보여줄지 말지 결정 */}
        {result ? ( // 삼항 연산자..
          <ResultModal
            content={"정상적으로 처리되었습니다."} //결과 모달창
            title={`${result}`}
            callbackFn={closeModal}
          />
        ) : (
          <></>
        )}
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Product Name</div>
            <input
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
              name="pname"
              type={"text"}
              value={product.pname}
              onChange={handleChangeProduct}
            ></input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Desc</div>
            <textarea
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
              name="pdesc"
              row="4"
              onChange={handleChangeProduct}
              value={product.pdesc}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Price</div>
            <input
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
              name="price"
              type={"number"}
              value={product.price}
              onChange={handleChangeProduct}
            ></input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">DELETE</div>
            <select
              name="delFlag"
              value={deleteType}
              onChange={handleChange}
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            >
              <option value="soft">사용</option>
              <option value="hard">삭제</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Files</div>
            <input
              ref={uploadRef}
              className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
              type={"file"}
              multiple={true}
            ></input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">Images</div>
            <div className="w-4/5 justify-center flex flex-wrap items-start">
              {product.uploadFileNames.map((imgFile, i) => (
                <div
                  className="flex justify-center flex-col w-1/3 m-1 align-baseline"
                  key={i}
                >
                  <button
                    className="bg-blue-500 text-3xl text-white"
                    onClick={() => deleteOldImages(imgFile)}
                  >
                    DELETE
                  </button>
                  <img
                    alt="img"
                    src={`${host}/api/products/view/s_${imgFile}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-x1 w-32 text-white bg-red-500"
          onClick={handleClickDelete}
        >
          DELETE
        </button>

        <button
          type="button"
          className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-orange-500"
          onClick={handleClickModify}
        >
          Modify
        </button>

        <button
          type="button"
          className="rounded p-4 m-2 text-x1 w-32 text-white bg-blue-500"
          onClick={moveToProductList}
        >
          LIST
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
