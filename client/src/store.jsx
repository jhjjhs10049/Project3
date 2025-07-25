import { configureStore } from "@reduxjs/toolkit";
import loginSlice from './slices/loginSlice'
import cartSlice from './slices/cartSlice';


// Store ? 전역변수 개념이다.
// Store 객체 생성을 위해 configureStore 를 사용
const store = configureStore({
    reducer: {
        "loginSlice" : loginSlice,   // 생성된 slice 를 store 에 설정
        "cartSlice" : cartSlice
    }
});

export default store;