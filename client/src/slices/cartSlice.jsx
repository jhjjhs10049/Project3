import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartItems, postChangeCart } from "../api/cartApi";

//현재 사용자의 장바구니에 담겨 있는 장바구니 아이템들을 조회
export const getCartItemAsync = createAsyncThunk('getCartItemAsync', () => {
    return getCartItems()
})

//장바구니 아이템을 추가하거나 수량을 변경
export const postChangeCartAsync = createAsyncThunk('postCartItemAsync', (param) => {
    return postChangeCart(param)
})

const initState = []    // 장바구니의 초기상태는 빈 배열

const cartSlice = createSlice ({
    name : 'cartSlice',
    initialState : initState,
                                     // 비동기 통신의 상태에 따라 동작하는 함수들을 작성한다.  (builder 는 스프링에서 사용하던 것과 같은 개념이리고 생각하자)
    extraReducers : (builder) => {   //extraReducers 는 slice 외부에서 생성된 액션들(예: createAsyncThunk)을 처리할 수 있게 해줍니다.
        builder.addCase(             //state : 현재 slice의 상태 객체, action : Redux 액션 객체 (payload 포함)  
            getCartItemAsync.fulfilled, (state, action) => {    // 머리글(prefix)이 첫번째 매개변수 getCartItemAsync 이다. 
                //console.log("getCartItemsAsync fullfilled")
                //console.log("payload:", action.payload);
                //return action.payload   //API 서버 호출결과(action.payload )는 모두 장바구니 아이템들의 배열 이므로 이를 상태 데이터(initState)로 보관한다.
           
                //위 코드는 책의 예제 코드인데 Type Error 문제가 계속 발생 합니다.
                //원인 : 서버에서 응답해주는 타입이 배열일때는 문제가 없는데 객체일때 문제가 발생합니다.
                //예) payload 의 값을 콘솔로 열어보면 { error: 'ERROR_ACCESS_TOKEN' } 입니다.. 즉 객체로 응답이 옵니다.
                //즉, { error: 'ERROR_ACCESS_TOKEN' } 객체가 전송이 될때마다 Type Error 이 발생합니다.
                //cartItems 에 선언된 타입은 initState = []  배열 인데  { error: 'ERROR_ACCESS_TOKEN' }  와 같은 객체가 들어오니 에러가 발생했습니다.
                //그래서 아래코드처럼 배열일때는 정상 리턴을 해주고 배열이 아닐때는 빈 배열을 리턴해 주도록 변경 했습니다.
                //참고로 rejected 상태도 컨트롤 해야 한다면 아래 코드를 추가해 주세요
                //.addCase(getCartItemAsync.rejected, (state, action) => {
                //    console.error("Failed to fetch cart:", action.error.message);
                //   return []; // 에러 시 배열로 초기화
                //});

                console.log("getCartItemsAsync fullfilled")
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    return payload;     //API 서버 호출결과(action.payload )는 모두 장바구니 아이템들의 배열 이므로 이를 상태 데이터(initState)로 보관한다.
                }
                console.error("Cart payload is not an array:", payload);
                return []; // 배열이 아닐 땐 빈 배열로 초기화
           
           
            }
        )
        .addCase(
            postChangeCartAsync.fulfilled, (state, action) => { // fulfilled ? 비동기 작업이 성공적으로 완료되어 결과 값을 반환한 상태.
                //console.log("postCartItemAsync fulfilled")
                //return action.payload   //API 서버 호출결과(action.payload )는 모두 장바구니 아이템들의 배열 이므로 이를 상태 데이터(initState)로 보관한다.
            
                //console.log("postCartItemAsync fulfilled")
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    return payload;         //API 서버 호출결과(action.payload )는 모두 장바구니 아이템들의 배열 이므로 이를 상태 데이터(initState)로 보관한다.
                }
                console.error("Cart payload is not an array:", payload);
                return []; // 배열이 아닐 땐 빈 배열로 초기화
            
            }
        )
    }
})

export default cartSlice.reducer