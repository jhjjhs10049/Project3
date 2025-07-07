import { Outlet, useNavigate } from "react-router-dom"
import BasicLayout from "../../layouts/BasicLayout"
import { useCallback } from "react"

const IndexPage = () => {

    //useNavigate() : 상황에 따라 동적으로 데이터를 처리해서 이동하는 경우에 사용 (<Native>나 <Link> 대신에 사용하자)
    const navigate = useNavigate() 

    const handleClickList = useCallback(() => {
        navigate({ pathname : 'list'})
    })
    
        const handleClickAdd = useCallback(() => {
        navigate({ pathname : 'add'})
    })


    return (
        //<></>
        <BasicLayout>  
            <div className="text-black font-extrabold -mt-10">Products Menu</div>
            <div className="w-full flex m-2 p-2">
                <div className="text-x1 m-1 p-2 w-20 font-extrabold text-center underline" onClick={handleClickList}>LIST</div>
                <div className="text-x1 m-1 p-2 w-20 font-extrabold text-center underline" onClick={handleClickAdd}>ADD</div> 
            </div>

            <div className="flex flex-wrap w-full">
                <Outlet/>
            </div>


        </BasicLayout>            
            
    );
}

export default IndexPage;