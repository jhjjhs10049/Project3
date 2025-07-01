import { useEffect, useState } from "react";
import { getList } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";


const initState = {
    dtoList : [],
    pageNumList : [],
    pageRequestDTO : null,
    prev : false,
    next : false,
    totalCount : 0,
    prevPage : 0,
    nextPage : 0,
    totalPage : 0,
    current : 0
}

const ListComponent = () => {
    //const { page, size } = useCustomMove()
    //const { page, size, moveToList } = useCustomMove()  //moveToList 가 추가적으로 필요
    const { page, size, refresh, moveToList, moveToRead } = useCustomMove()

    //serverData는 나중에 사용
    const [ serverData, setServerData ] = useState(initState)

    useEffect(() => {
        getList({page, size}).then(data => {
            console.log(data)
            //data.pageNumList = [1, 2, 3]; // 하드코딩 추가
            setServerData(data)
        })
    }, [page, size, refresh])   // next 와 prev 가 refresh가 안되는 문제가 생긴다. 항상은 아니고 특정 조건에서..

    return (
        <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
            {/* Todo List Component */}
            <div className="flex flex-wrap mx-auto justify-center p-6">
                {serverData.dtoList.map(todo => 
                    <div key={todo.tno} className="w-full min-w-[400px] p-2 rounded shadow-md" onClick={() => moveToRead(todo.tno)}>                    

                        <div className="flex ">
                            <div className="font-extrabold text-2xl p-2 w-1/12">{todo.tno}</div>    
                            <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">{todo.title}</div>
                            <div className="text-1xl m-1 p-2 w-2/10 font-medium">{todo.dueDate}</div>
                        </div>

                    </div>
                )}
            </div>

            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>

        </div>
    );
}

export default ListComponent;