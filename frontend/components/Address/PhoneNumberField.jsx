import React from "react";

const PhoneNumberField = ({ value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium">Số điện thoại</label>
    <input
      type="text"
      name="phoneNumber"
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Nhập số điện thoại"
      required
    />
  </div>
);

export default PhoneNumberField;
