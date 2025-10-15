const CheckoutItem = ({ item }) => {
  return (
    <div className="flex justify-between items-center mb-4 pb-2">
      <div className="flex items-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded object-cover mr-4"
        />
        <div>
          <h3 className="font-medium text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">Màu: {item.color}</p>
          <p className="text-sm text-gray-500">Kích cỡ: {item.size}</p>
        </div>
      </div>
      <span className="text-gray-800 font-medium">
        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
      </span>
    </div>
  );
};

export default CheckoutItem;
