import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
 
const BasicMenu = () => {
    //useSelector ? 애플리케이션의 상태를 받아서 자신이 원하는 상태 데이터를 선별(selector) 하는 용도
    //여기서는 컴포넌트가 로그인 상태가 변경되는것을 감지 한다. 동기 방식으로 동작 하므로 상태가 변경 되면 즉시 감지 한다.
    // loginState 에는 로그인 상태 정보가 즉시 저장 된다.
    const loginState = useSelector(state => state.loginSlice) // store 상태(state)를 받아와서 그중에 loginSlice 를 사용

    return ( 
        <nav id='navbar' className=" flex bg-blue-300">
            <div className="w-4/5 bg-gray-500" >
                <ul className="flex p-4 text-white font-bold">
                    <li className="pr-6 text-2xl">
                        <Link to='/'>Main</Link>
                    </li>
                    <li className="pr-6 text-2xl">
                        <Link to='/about'>About</Link>{/* '/about' 인데 Todo는 '/todo/' 이다. 뒤에 '/'가 하나더 있다. 하위 경로 처리를 위해서 뒤에 '/'가 추가되었다.  */}
                    </li>
                    <>
                        <li className="pr-6 text-2xl">
                        <Link to='/todo/'>Todo</Link>{/*Todo를 누르면 '/Todo/' 경로를 호출하고 root.jsx 에서 /Todo/ 경로를 처리한다 ../pages/todo/IndexPage 로 이동 */}
                        </li>
                        <li className="pr-6 text-2xl">
                            <Link to='/products/'>Products</Link>{/* Products 를 누르면 '/products/' 경로를 호출하고 root.jsx 에서 /products/ 경로를 처리한다. */}
                        </li>
                    </>
                                   
                </ul>
            </div>


            <div className="w-1/5 flex justify-end bg-grange-300 p-4 font-medium">
            { ! loginState.email ?      // 로그인 상태가 아니라면
                <div className="text-white text-sm m-1 rounded">
                    <Link to={'/member/login'}>Login</Link>
                </div>
                : 
                <div className="text-white text-sm m-1 rounded">
                    <Link to={'/member/logout'}>Logout</Link>
                </div>
            }
                
            </div>
        </nav>
    );
}

 export default BasicMenu;
