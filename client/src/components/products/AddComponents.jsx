import { useRef, useState } from "react";
import { postAdd } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
    pname : '',
    pdesc : '',
    price : 0,
    files : []
}


const AddComponent = () => {

    // Fetching ? 데이터가 도착하지 않은 상태 (처리중 or 로딩중)
    //서버와의 통신 상태를 Fetching 이라는 state를 이용해서 제어한다.
    //API 서버가 호출할때 Fetching 상태를 true로 해주고, 데이터를 가져온 후에는 false로 변경 (false 이면 화면에서 모달이 사라지도록 한다.)
    const [fetching, setFetching] = useState(false)

    const [product, setProduct] = useState({...initState})


    /** 
        목적	            useState	                useRef
        값 저장	            렌더링 후 저장	            렌더링과 무관하게 유지
        값 업데이트 방식	setState 호출 → 렌더링됨	ref.current = ... 즉시 저장
        리렌더링 여부	    발생	                    발생하지 않음
        렌더 중 접근 가능	가능	                    읽을 수는 있으나 쓰려면 위험(렌더 중에 ref.current 사용은 피하는 게 안전해요. 렌더 외부(이펙트나 이벤트 핸들러)에서 접근하세요.)

    */

    const uploadRef = useRef()  //DOM에 접근하거나, 렌더와 관련 없는 정보를 저장할 때 useRef를 사용하세요.
                                //값을 바꾸더라도 리렌더링이 일어나지 않으므로 성능 최적화에 도움 됩니다.
                                //그러나 값이 UI에 표시되거나 동적으로 변해야 한다면 useState를 사용해야 합니다.
     
    const [result, setResult] = useState(false)

    const {moveToList} = useCustomMove();

    const handleChangeProduct = (e) => {
        product[e.target.name] = e.target.value
        setProduct({...product})
    }

    const handleClickAdd = () => {
        console.log(product)

        // 여기서 useRef()(여기서는 uploadRef)는 기존의 자바스크립트에서 document.getByElementById()와 유사한 역할을 한다.
        const files = uploadRef.current.files   // ref = uploadRef 를 찾아서 유저가 선택한 파일들을 가져온다. 
        const formData = new FormData() // FormData() : 자바 스크립트에서 파일 업로드나 폼 데이터를 서버로 전송할때 사용하는 객체

        for(let i = 0; i<files.length; i++){
            formData.append("files", files[i]); // 유저가 선택한 파일들을 FormData 에 append() 를 사용해서 넣어주고 있다.
        }

        //other data
        formData.append("pname", product.pname)
        formData.append("pdesc", product.pdesc)
        formData.append("price", product.price)

        console.log(formData)

        //postAdd(formData)

        // ADD 버튼이 클릭 되었을때 모달을 보이게 했다가(true) 서버와의 통신이 끝나면 모달을 사라지게 한다.(false)
        // 순서 : setFetching(true) → 렌더 → FetchingModal 표시 → API 통신 → setFetching(false) → 다시 렌더 → 모달 숨김 등 
        // result 도 마찬가지로 값이 바뀌면 리 렌더링을 할테고 true 이면 ResultModal 을 호출한다.
        // 94번 라인에 ResultModal 을  호출 하면서 callbackFn = {closeModal} 이 매개변수로 넘어간다.
        // ResultModal 에서 close modal 버튼을 누르면 closeModal() 이 호출되면서  ResultModal 이 종료 된다. 
        // 85번 라인에서 moveToList() 를 이용해서 /product/list/ 로 이동한다.
        
        setFetching(true) 
        // postAdd() 가 비동기 함수 이므로 서버와의 통신이 끝났을때 false로 변경한다. 
        postAdd(formData).then(data => {
            setFetching(false)      // 서버와의 통신이 끝났으니 false 라는 값을 넣어서 FetchingModal 를 사라지게 한다.
            setResult(data.result)  //서버에서 상품이 등록되면 전송되는 JSON 데이터는 result 라는 속성을 가진다.
        })


    }

    const closeModal = () => {
        setResult(null) //ResultModal 종료
        
        //moveToList()로 이동은 할텐데 ../list 경로를 처리하는 라우터가 2개다(productRouter 와 todoRouter)
        //둘다 같은 경로 ../list를 처리하고 있는데 아래코드처럼 moveToList를 호출하면 어떻게 
        //필요한 라우터를 찾아갈까?
        //moveToList({page:1})가 호출될 때 어떤 “list” 라우터로 이동하는지는, 
        // 사용 중인 라우팅 구조—즉 컴포넌트가 현재 어떤 경로 아래에 렌더되고 있는지에 따라 달라집니다.
        // 현재 사용중인 컴포넌트(AddComponent)가 products 아래에서 렌더되고 있으니 productRouter을 찾아간다.
        // 구조를 한번 보자. 현재 상태는 product/indexPage/AddPage/AddComponent 이다.
        // root를 보면 /products 경로에 대한 라우터 처리를 하고있고
        // productRouter 에서 list 경로에 대한 처리를 하고 있다.

        moveToList({page:1}) // 모달 창이 닫히면 리스트로 이동
    }



    return (
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4"> 
            { fetching ? <FetchingModal/> : <></> }         {/* FetchingModal 을 보여줄것인지 여부 */}

            {result ? <ResultModal  
                        title = {'Product Add Result'}
                        content = {`${result}번 등록 완료`}
                        callbackFn = {closeModal}/> 
                    : <></>
            } 


            <div className="flex justify-center">
                {/* <h1>Product Add Component</h1> */} 
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Product Name</div> 
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
                        name="pname"
                        type={'text'} 
                        value={product.pname}
                        onChange={handleChangeProduct}
                        >
                    </input>       
                </div> 
            </div>

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <div className="w-1/5 p-6 text-right font-bold">Desc</div>
                    <textarea 
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
                        name="pdesc"
                        rows="4"
                        onChange={handleChangeProduct}
                        value={product.pdesc}>
                        {product.pdesc}
                    </textarea>
                </div>  
            </div>


            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <div className="w-1/5 p-6 text-right font-bold">Price</div>
                <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
                    name="price"
                    type={'number'} 
                    value={product.price}
                    onChange={handleChangeProduct}
                >
                </input>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full  flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Files</div>
                    <input ref={uploadRef} /* 파일 선택버튼 이미지가 안보임 */
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
                        type={'file'} multiple={true}
                    >    
                    </input>
                </div>  
            </div>

            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                <button type="button" 
                    className="rounded p-4 w-36 bg-blue-500 text-xl  text-white "
                    onClick={handleClickAdd}
                >
                ADD
                </button>
                
                </div>
            </div>


        </div>
    );
}

export default AddComponent;