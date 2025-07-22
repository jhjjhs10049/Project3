
import { useEffect, useMemo } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import CartComponent from "../../components/shoppingCart/CartComponent";
import BasicLayout from "../../layouts/BasicLayout";

const CartPage = () => {
  const { isLogin, loginState } = useCustomLogin();
  const { refreshCart, cartItems, changeCart } = useCustomCart();

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  useEffect(() => {
    if (isLogin) {
      refreshCart();
    }
  }, [isLogin, refreshCart]);

  return (
    <BasicLayout>
      <div className="p-6">
        {isLogin ? (
          <>
            <div className="text-2xl font-bold mb-4">
              {loginState.nickname}'s Cart
            </div>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <CartComponent                      // 카트 컴포넌트
                  key={item.cino}
                  {...item}
                  email={loginState.email}
                  changeCart={changeCart}
                />
              ))}
            </ul>
            <div className="text-right text-2xl font-extrabold mt-6">
              TOTAL: {total.toLocaleString()} 원
            </div>
          </>
        ) : (
          <div className="text-center text-xl text-red-500">
            로그인 후 장바구니를 확인하세요.
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default CartPage;