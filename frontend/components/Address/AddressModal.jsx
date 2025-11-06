import React from "react";
import AddressManager from "../Profile/AddressManager";

const AddressModal = ({ onClose, address, existingAddresses }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={() => onClose(null)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {address ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </h2>
        <AddressManager
          prefilledAddress={address}
          showList={false}
          onClose={(updatedList) => onClose(updatedList)}
          existingAddresses={existingAddresses}
        />
      </div>
    </div>
  );
};

export default AddressModal;
