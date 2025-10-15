const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <tr className="border-b border-gray-300">
      {/* Product details */}
      <td className="p-4 flex gap-4">
        <img
          src="https://via.placeholder.com/80"
          alt={item.name}
          className="w-20 h-20 object-cover"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">Size: L</p>
          <p className="text-sm text-gray-500">Color: Purple</p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-500 hover:underline hover:cursor-pointer mt-1"
          >
            Xóa
          </button>
        </div>
      </td>

      {/* Price */}
      <td className="p-4 text-center">{item.price.toLocaleString("vi-VN")} ₫</td>

      {/* Quantity controls */}
      <td className="p-4 text-center">
        <div className="inline-flex border-gray-700 rounded">
          <button
            className="px-3 py-1 cursor-pointer"
            onClick={() => onDecrease(item.id)}
          >
            −
          </button>
          <span className="px-4 py-1">{item.quantity}</span>
          <button
            className="px-3 py-1 cursor-pointer"
            onClick={() => onIncrease(item.id)}
          >
            +
          </button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="p-4 text-center font-medium">
        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
      </td>
    </tr>
  );
};

export default CartItem;
