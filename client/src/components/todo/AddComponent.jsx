import { useState } from "react";
import { postAdd } from "../../api/todoApi";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
    title : '',
    writer : '',
    dueDate : ''
}

const AddComponent = () => {

    const [todo, setTodo] = useState({...initState})

    //결과 데이터가 있는 경우에는 ResultModal을 보여준다.
    const [result, setResult] = useState(null) //결과 상태

    const {moveToList} = useCustomMove() //useCustomMove 활용

    const handleChangeTodo = (e) => {
        todo[e.target.name] = e.target.value    //todo[title] = input 에 입력된 값(todo.title)
        setTodo({...todo})
    }

    const handleClickAdd = () => {
        console.log(todo)
        postAdd(todo).then(result => {
            console.log(result)
            
            setResult(result.TNO)   //결과 데이터 변경
            //초기화
            setTodo({...initState})
        }).catch(e => {
            console.error(e)
        })
    }

    const closeModal = () => {
        setResult(null)
        moveToList() //moveToList() 호출
    }



    return (
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4"> 

            {/* 모달 처리 (삼항 연산자)*/}
            {result ? <ResultModal title={'Add Result'} content={`New ${result} Added`} callbackFn={closeModal}/> : <></> }


            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md" 
                        name="title"
                        type={'text'} 
                        value={todo.title}
                        onChange={handleChangeTodo}>
                    </input>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
                    <input className="w-4/5 p-6 rounded-r border border-soild border-neutral-500 show-md" 
                        name="writer"
                        type={'text'}
                        value={todo.writer}
                        onChange={handleChangeTodo}
                    >
                    </input>    
                </div>
            </div>


            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
                    <input className="w-4/5 p-6 rounded-r border border-soild border-neutral-500 show-md" 
                        name="dueDate"
                        type={'date'}   // data 타입을 설정하면 달력 버튼과 기능을 자동으로 제공해준다.
                        value={todo.dueDate}
                        onChange={handleChangeTodo}
                    >
                    </input> 
                </div>
            </div>

            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                    <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white" onClick={handleClickAdd}>
                        ADD
                    </button>
                </div>
            </div>

            
        </div>
        
    );
}

export default AddComponent