import React from "react";

const DefaultCheckbox = ({ checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      name="isDefault"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label className="ml-2 text-gray-700">Đặt làm địa chỉ mặc định</label>
  </div>
);

export default DefaultCheckbox;
