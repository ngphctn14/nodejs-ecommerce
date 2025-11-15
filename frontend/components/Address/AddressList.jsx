import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AddressModal from "./AddressModal";

const AddressList = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosClient.get("/addresses");
        const allAddresses = res.data;
        setAddresses(allAddresses);
        if (allAddresses.length > 0) {
          const defaultAddress =
            allAddresses.find((addr) => addr.isDefault) || allAddresses[0];

          onSelect(defaultAddress);

          setSelectedAddressId(defaultAddress._id);
        }
      } catch (err) {
        console.error("Lỗi tải địa chỉ:", err);
      }
    };
    fetchAddresses();
  }, []);

  const handleSelect = (addr) => {
    setSelectedAddressId(addr._id);
    onSelect(addr);
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowModal(true);
  };

  const handleNewAddress = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleModalClose = (updatedList) => {
    if (updatedList) setAddresses(updatedList);
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className={`border rounded-md p-4 flex justify-between items-start cursor-pointer ${
            selectedAddressId === addr._id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
          onClick={() => handleSelect(addr)}
        >
          <div className="flex-1">
            <label className="flex items-start space-x-3">
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === addr._id}
                onChange={() => handleSelect(addr)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {addr.phoneNumber}{" "}
                  {addr.isDefault && (
                    <span className="text-green-600 text-sm ml-1">
                      [Mặc định]
                    </span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">
                  {addr.addressLine}, {addr.ward}, {addr.province}
                </p>
              </div>
            </label>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(addr);
            }}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Cập nhật
          </button>
        </div>
      ))}

      <div className="text-center mt-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNewAddress();
          }}
          className="text-blue-600 hover:underline"
        >
          + Thêm địa chỉ mới
        </a>
      </div>

      {showModal && (
        <AddressModal
          onClose={handleModalClose}
          address={editingAddress}
          existingAddresses={addresses}
        />
      )}
    </div>
  );
};

export default AddressList;
