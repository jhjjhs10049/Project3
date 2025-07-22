import { createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie, removeCookie, setCookie } from "../util/cookieUtil";


/**********************************************************************************************************************
 * 리덕스? 
 * Redux는 JavaScript 앱에서 **전역 상태(state)**를 일관되고 예측 가능하게 관리할 수 있도록 설계된 상태 관리 라이브러리입니다.
 * 개인적인 구조의 이해 : Store는 전역 공유 메모리 공간, Store 안에 있는 slice 는 전역객체 로 이해했습니다. 
 * 컴포넌트는 어디에서든 useSelector 혹은 useDispatch 로 store 에 있는 slice로 접근 가능 합니다.
 * useSelector : store 상태 조회 (자바의 getter 와 비슷한 개념)
 * useDispatch : store 상태 변경 (실제 동작은 reducers 안에 있는 함수를 호출해서 state를 변경 한다. (자바의 setter 와 비슷한 개념))
 * store 에 action을 보냄 -> 상태 변경 유도   (로그인 의 예를 들면 action.payload 에 들어있는 값은 id/pw 입니다.) 
 **********************************************************************************************************************/


/******************************************************************************************
 * createSlice ? 
 * slice의 이름, 초기 상태, reducer 함수를 한번에 정의
 * 자동 생성 : reducer, actions
 * 사용 목적 : slice를 만든다.
 * slice ? 
 * Redux 전체 상태(state)의 일부분(조각, 단면)을 의미
 * Redux 앱 전체의 상태 트리는 하나의 큰 state 객체인데,
 * 이 큰 state를 기능별, 도메인 별로 나눠 관리하기 위해 만든 단위를 "slice" 라고 합니다.
 * 예시로 쉽게 보기 : 
 * 전체 Redux 상태 (예)
 * {
 *      user : {name : 'Alice', isLogin: true},
 *      products : [{id:1 , name : 'iPhone'}]
 * }
 * 여기서 :
 * user -> userSlice로 관리
 * products -> productSlice 로 관리
 * 즉 전체 상태를 기능별로 "조각(slice)" 내서 분리 합니다.
 *************************************************************************************************/


/*****************************************************************************************************************************************
 * createAsyncThunk ? 
 * 비동기 작업을 생성하기 위한 함수. 주로 API 요청 같은 작업에 사용 
 * createAsyncThunk 의 첫번째 인자 : 액션 타입 문자열
 * createAsyncThunk 의 두번째 인자 : 비동기 함수를 받음(API 요청 등)
 * 반환값 : AsyncThunk 타입 객체
 * 
 * AsyncThunk ? 
 * AsyncThunk는 createAsyncThunk가 반환하는 **타입(객체)**입니다. TypeScript에서 주로 타입 추론이나 타입 선언에 사용됩니다.
 * AsyncThunk(typePrefix, payloadCreator)는 내부적으로 AsyncThunk<Returned, ThunkArg, ThunkApiConfig> 타입의 객체를 자동으로 생성합니다.
 * 즉, 첫 번째 인자와 두 번째 인자는 이 AsyncThunk 타입 객체를 정의하는 데 중요한 역할을 합니다.
 * 
 * 첫번째 인자 : typePrefix = 이 문자열은 생성 되는 액션의 prefix(머리글) 입니다.
 * 이 값은 Redux 액션 타입(pending, fulfilled, rejected)에 접두어로 사용됩니다.
 * 예를 들어, 내부적으로 다음과 같은 액션 타입이 생성됩니다:
 * 'loginPostAsync.pending'  (대기)
 * 'loginPostAsync.fulfilled'(완료)
 * 'loginPostAsync.rejected' (거절)
 * 
 * 두번째 인자 : payloadCreator = 이 함수는 실제로 비동기 작업을 수행하는 함수 입니다.
 * (param) => {
 *      return loginPost(param)
 * }
 * 이 함수는 실제로 비 동기 작업을 수행하는 함수 입니다.
 * param은 thunk가 실행될 때 넘기는 매개변수 (ThunkArg)이고, loginPost(param)의 반환값이 payload (Returned)가 됩니다.
 * 
 * 
 * 요약
 * createAsyncThunk	: 비동기 thunk 액션 생성 함수
 * AsyncThunk	    : createAsyncThunk가 반환하는 thunk 액션의 타입 정의 (TypeScript에서 유용)
 * 
 * 
 * createAsyncThunk 사용 목적 : 
 * fetch , axios 같은 API 호출을 캡슐화
 * pending, fulfilled, rejected 액션을 자동 생성
 * 로딩/성공/에러 상태를 분리 해서 상태 관리를 명확하게 나눌 수 있음
 * API 로직을 slice 바깥에서 정의 -> slice 가 깔끔해짐
 *************************************************************************************************************************************/





const initState = {
    email : ''
}

const loadMemberCookie = () => {    //쿠키에서 로그인 정보 로딩
    const memberInfo = getCookie("member")

    //닉네임 처리
    if(memberInfo && memberInfo.nickname) {//decodeURIComponent: URL 인코딩된 문자열(%20, %2F 등등)을 원래 문자열로 되돌리는 함수
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)   
    }

    return memberInfo
}

/************************************************************************************
 * createAsyncThunk 코드 흐름및 분석
 * 내부적으로 pending(대기), fulfilled(완료), rejected(거절) 세 가지 액션 타입을 자동 생성
 * 첫번째 인자 'loginPostAsync' : 액션의 prefix(머리글) 입니다.  
 * prefix를 기반으로 Redux는 세 가지 액션을 자동으로 만든다.
 * loginPostAsync.pending(대기)
 * loginPostAsync.fulfilled(완료) 
 * loginPostAsync.rejected (거절))
 * 이 액션들은 Redux slice의 extraReducers에서 사용됩니다.
 * 
 * extraReducers ?
 * Redux Toolkit의 createSlice에서 사용하는 옵션으로, 
 * slice 외부에서 생성된 액션들(예: createAsyncThunk)을 처리할 수 있게 해줍니다.
 * 
 * 
 * 첫번째 인자 state : 현재 slice의 상태 객체
 * 두번째 인자 (param) => loginPost(param)
 * 비동기 로직을 실행하는 payloadCreator 함수입니다.
 * param은 thunk를 호출할 때 넘기는 인자(매개변수)이며
 * loginPost(param)는 실제 API 요청 함수입니다.
 * 
 * 코드의 흐름 
 * createAsyncThunk 를 실행 해서 AsyncThunk 를 만든다. 
 * thunk 는 내부적으로 pending, fulfilled, rejected 를 만든다.
 * 첫번째 매개변수의 이름을 머리글로 해서 액션의 이름을 완성한다.  (예 : loginPostAsync.pending)
 * 외부에서 thunk 를 호출 할때 dispatch(loginPostAsync(param)) 형식으로 호출을 하게된다.
 * 매개변수 param 을 넘겨받아서  return loginPost(param) 를 수행하고 
 * 비동기 함수 loginPost() 를 수행한 결과값을 리턴한다.
 */


/**********************************************************************************************
 * 로그인 버튼 클릭시 기본 동작 순서
 * dispatch(loginPostAsync) 호출
 * loginPost() 내부에서 axios.post('/login') ← 일반 axios 사용 (interceptor 없음)
 * 로그인 성공 → accesstoken 과 refreshToken 을 쿠키에 저장 하고 로그인 과정은 끝이난다.
 * 
 * 이후 API 요청(todo, product 메뉴 접근시)에 jwtAxios 사용
 * jwtAxios → interceptor 호출 → 토큰 붙여서 요청 전송
 **********************************************************************************************/

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    return loginPost(param)
})

// 기존 방식 (복잡함)
// const loginAction = () => {
//     return async (dispatch) => {
//         dispatch({ type: 'LOGIN_PENDING' });
//         try {
//             const result = await loginPost(param);
//             dispatch({ type: 'LOGIN_SUCCESS', payload: result });
//         } catch (error) {
//             dispatch({ type: 'LOGIN_FAILURE', payload: error });
//         }
//     };
// };

// createAsyncThunk 방식 (간단함)
// const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
//     return loginPost(param);
// });


  


// 로그인 할때는 서버랑 통신을 하므로 비동기 방식을 사용하고 로그아웃 할때는 (reducers)동기 방식을 사용한다. 그래서 login / logout 은 동기방식이다.
// 그래서 로그인 할때는 reducers 에 있는 login 을 사용하지 않고 비동기 방식(loginPostAsync)을 사용한다.
//createSlice 는 동기 처리만 가능하다. 비동기 처리는 안되지만 대신 CreateAsyncThunk + extraReducers 사용하면 비동기 처리도 가능하다.
//loginSlice 가 실행 될때 member 쿠키를 먼저 찾아보고(loadMemberCookie) 없는 경우에는 기본값을 가지도록 했다.
const loginSlice = createSlice({    // createSlice() 로 만든 loginSlice 를 Store 에 저장 한다.
    name : 'LoginSlice',            // slice 의 이름(각각의 슬라이스 구분, 고유하고 명확한 이름 사용, action.type 으로 사용(extraReducers 에서 액션 비교할때 사용))
    // state 의 초기값이 될 initState
    initialState : loadMemberCookie() || initState, //쿠키가 없다면 초기값 사용    
    reducers : {                    // reducers? initState 에 저장된 값을 다루는 함수들(리듀서 안에 함수는 동기 함수이며, 비동기 함수는 리듀서 밖에서 처리해야한다.)
        login : (state, action) => {// state 는 기본값이 {email : ''} 인 객체입니다.state 는 LoginSlice 의 현재상태 객체입니다. initialState 로 지정했던 값들입니다.   
            console.log("login...") // 유저가 id/pw 로 로그인을 하면 action 에 id/pw 가 저장되어 날아 옵니다.

            //{email, pw로 구성}
            const data = action.payload //action의 payload 라는 속성을 이용해서 LoginComponent 가 전달 하는 데이터를 받습니다.
            //새로운 상태
            return {email : data.email} //email 을 loginSlice 에 리턴해 줍니다.(initState 의 email 값이 유저가 로그인한 값으로 변경 됩니다.)
        },                              
        logout : () => {
            console.log("logout...")
            removeCookie("member") // 로그 아웃할 경우 쿠키 삭제(브라우저에서 확인시 로그아웃한뒤 다른 메뉴 클릭 했다가 다시 확인 해보면 사라져 있다.)
            // loginSlice 에서 email 값이 없거나 빈 문자열이 되도록 만든다.    
            return{...initState}    // ...initState 가 initState의 복사본 인데 
                                    // 로그인을 먼저 하고 로그아웃을 하면 어떻게 되는가?
                                    // 로그인한 정보를 복사해서 가지고 오면 초기화가 안되는거 아닌가?
                                    // 이 코드의 의미는 return (email : '') 이다. 내부 동작이 궁금하다면 챗GPT ~
        }
    },  // 비동기 통신의 상태에 따라 동작하는 함수들을 작성한다.  (builder 는 스프링에서 사용하던 것과 같은 개념이리고 생각하자)
    extraReducers : (builder) => {      //extraReducers 는 slice 외부에서 생성된 액션들(예: createAsyncThunk)을 처리할 수 있게 해줍니다.
        //state : 현재 slice의 상태 객체, action : Redux 액션 객체 (payload 포함)  
        builder.addCase( loginPostAsync.fulfilled, (state, action) => { // 비동기 통신의 상태에 따라 동작하는 함수들을 작성한다.
            console.log("fulfilled")                                   // 머리글(prefix)이 첫번째 매개변수 loginPostAsync 이다. 
            
            const payload = action.payload //action 의 payload 속성을 이용해서 데이터(loginPost(param) 반환값) 를 전달 받는다.
                                           //즉,
                                           //  payload 에는 email, social, nickname, pw, 토큰들, 권한들 같은 정보가 들어있다.
            //정상적인 로그인시에만 저장
            if(!payload.error){     //JSON.stringify : 자바스크립트 객체를 문자열형태(JSON) 로 만든다.
                setCookie("member", JSON.stringify(payload), 1) // 1일
            }
            
            
            return payload  // 기존 state(initState) 를 payload 로 변경한다. (ex : 기존의 email = 1 이었다면 email = 2 로 변경)
        })
        .addCase(loginPostAsync.pending, () => {
            console.log("pending")
        })
        .addCase(loginPostAsync.rejected, () => {
            console.log("rejected")
        })
    }
})

// login, logout 을 외부에서 호출 할수 있도록 설정
export const {login, logout} = loginSlice.actions

// 생성된 리듀서를 추출 ... reducer 이다.
export default loginSlice.reducer