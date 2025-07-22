// src/components/cart/CartItemComponent.jsx

import { API_SERVER_HOST } from "../../api/todoApi";
import { useNavigate } from "react-router-dom";

const host = API_SERVER_HOST;

const CartComponent = ({
  cino,
  pname,
  price,
  pno,
  qty,
  imageFile,
  changeCart,
  email,
}) => {
  const navigate = useNavigate();

  const handleClickQty = (amount) => {
    changeCart({ email, cino, pno, qty: qty + amount });
  };

  const handleClickProduct = () => {
    navigate(`/products/read/${pno}?page=1&size=12`);
  };
  return (
    <li
      className="border-2 p-4 rounded-md shadow-sm flex gap-4 cursor-pointer" // hover:bg-gray-50 transition-colors
      onClick={handleClickProduct}
    >
      <div className="w-32">
        <img src={`${host}/api/products/view/s_${imageFile}`} alt={pname} />
      </div>
      <div className="flex-1 text-lg">
        <div>Pno: {pno}</div>
        <div className="font-semibold">Name: {pname}</div>
        <div>Price: {price} 원</div>
        <div
          className="flex items-center mt-2 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Qty: {qty}</span>
          <button
            onClick={() => handleClickQty(1)}
            className="bg-orange-500 text-white px-2 rounded"
          >
            +
          </button>
          <button
            onClick={() => handleClickQty(-1)}
            className="bg-orange-500 text-white px-2 rounded"
          >
            -
          </button>
          <button
            onClick={() => handleClickQty(-qty)}
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
        </div>
        <div className="mt-2 text-right font-bold">Total: {qty * price} 원</div>
      </div>
    </li>
  );
};

export default CartComponent;
