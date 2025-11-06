import React from "react";

const AddressLineInput = ({ value, onChange, disabled }) => (
  <div>
    <label className="block text-gray-700 font-medium">Số nhà, tên đường</label>
    <input
      type="text"
      name="addressLine"
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      placeholder="Nhập số nhà, tên đường"
      disabled={disabled}
      required
    />
    {disabled && (
      <p className="text-sm text-gray-500 mt-1">
        Vui lòng chọn tỉnh/thành phố và phường/xã trước khi nhập số nhà, tên đường.
      </p>
    )}
  </div>
);

export default AddressLineInput;
