import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { getCartItemAsync, postChangeCartAsync } from "../slices/cartSlice";

// 장바구니와 관련된 기능들을 정리해 보면 useCustomLogin 과도 밀접하게 관련이 있고
// useDispatch, useSelector 등도 사용해야 할 일이 많다.
// 그래서 이러한 기능들을 모아서 따로 관리하는게 편하다.

const useCustomCart = () => {
    // 함수는 상태 전체(state) 를 인자로 받아 state.cartSlice이라는 속성의 값을 반환한다. 
    // 이 반환값이 cartItems 변수에 저장된다.
    const cartItems = useSelector(state => state.cartSlice);

    const dispatch = useDispatch();

    // 현재 사용자의 장바구니에 담겨 있는 장바구니 아이템들을 조회
    const refreshCart = useCallback(() => {
        dispatch(getCartItemAsync());
    }, [dispatch]);

    // 장바구니 아이템을 추가하거나 수량을 변경
    const changeCart = useCallback((param) => {
        dispatch(postChangeCartAsync(param));
    }, [dispatch]);

    return { cartItems, refreshCart, changeCart };
};

export default useCustomCart;
