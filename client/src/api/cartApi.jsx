import jwtAxios from "../util/JWTUtil"
import { API_SERVER_HOST } from "./todoApi"

const host = `${API_SERVER_HOST}/api/cart`

//axios 가 아닌 jwtAxios 를 사용하는 이유? 
//사용되는 메서드 들이 현재 로그인 사용자의 정보를 이용하기 때문입니다.


//현재 사용자의 장바구니에 담겨 있는 장바구니 아이템들을 조회하기 위한 메서드
export const getCartItems = async () => {   
    const res = await jwtAxios.get(`${host}/items`)
    return res.data
}

//장바구니 아이템을 추가하거나 수량을 변경 하기 위한 메서드
export const postChangeCart = async (cartItem) => {
    const res = await jwtAxios.post(`${host}/change`, cartItem)
    return res.data
}