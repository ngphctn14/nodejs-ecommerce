import React, { useState, useEffect } from "react";
// import Select from "react-select"; // Unused in provided code, can be removed if not needed
import axiosClient from "../../api/axiosClient";

import PhoneNumberField from "../Address/PhoneNumberField";
import ProvinceSelect from "../Address/ProvinceSelect";
import WardSelect from "../Address/WardSelect";
import AddressLineInput from "../Address/AddressLineInput";
import DefaultCheckbox from "../Address/DefaultCheckbox";
import Button from "../Forms/Button"; // 👈 Import custom Button

const AddressManager = ({
  prefilledAddress = null,
  onClose = null,
  showList = true,
}) => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    phoneNumber: "",
    province: "",
    ward: "",
    addressLine: "",
    isDefault: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [rawAddressData, setRawAddressData] = useState(null);
  const [error, setError] = useState(null);

  // 🗺️ Load provinces and address data
  useEffect(() => {
    fetch("/data/vn_only_simplified_json_generated_data_vn_units.json")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải file JSON");
        return res.json();
      })
      .then((data) => {
        setRawAddressData(data);
        setProvinces(data.map((prov) => prov.FullName));
      })
      .catch((err) => {
        console.error("Lỗi tải dữ liệu địa chỉ:", err);
        setError("Không thể tải dữ liệu địa chỉ");
      });

    if (showList) {
      const fetchAddresses = async () => {
        try {
          const response = await axiosClient.get("/addresses");
          setAddresses(response.data);
        } catch (error) {
          console.error("Lỗi khi gọi API lấy địa chỉ:", error);
          setError("Không thể tải danh sách địa chỉ");
        }
      };
      fetchAddresses();
    }
  }, [showList]);

  // 🧭 When province changes, update wards
  useEffect(() => {
    if (formData.province && rawAddressData) {
      const rawProvince = rawAddressData.find(
        (prov) => prov.FullName === formData.province
      );
      const formattedWards =
        rawProvince?.Wards.map((ward) => ward.FullName) || [];
      setWards(formattedWards);
    } else {
      setWards([]);
    }
  }, [formData.province, rawAddressData]);

  // ✨ Pre-fill form when editing
  useEffect(() => {
    if (prefilledAddress) {
      setFormData({
        id: prefilledAddress._id,
        phoneNumber: prefilledAddress.phoneNumber || "",
        province: prefilledAddress.province || "",
        ward: prefilledAddress.ward || "",
        addressLine: prefilledAddress.addressLine || "",
        isDefault: prefilledAddress.isDefault || false,
      });
      setIsEditing(true);
    }
  }, [prefilledAddress]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prev) => {
      if (name === "province") {
        return {
          ...prev,
          province: value,
          ward: "",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // 💾 Add or Update Address
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = { ...formData };

    try {
      if (isEditing && formData.id) {
        await axiosClient.put(`/addresses/${formData.id}`, payload);
      } else {
        await axiosClient.post("/addresses", payload);
      }

      const updatedList = await axiosClient.get("/addresses");

      if (onClose) {
        onClose(updatedList.data);
      }

      if (showList) {
        setAddresses(updatedList.data);
      }

      handleResetForm();
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      setError("Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleEdit = (address) => {
    setFormData({
      id: address._id,
      phoneNumber: address.phoneNumber,
      province: address.province,
      ward: address.ward,
      addressLine: address.addressLine,
      isDefault: address.isDefault,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await axiosClient.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      setError("Không thể xóa địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axiosClient.put(`/addresses/${id}/set-default`);
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: addr._id === id }))
      );
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error);
      setError("Không thể đặt địa chỉ mặc định. Vui lòng thử lại.");
    }
  };

  const handleResetForm = () => {
    setFormData({
      id: null,
      phoneNumber: "",
      province: "",
      ward: "",
      addressLine: "",
      isDefault: false,
    });
    setIsEditing(false);
    setError(null);
  };

  // 🪄 Custom select styles
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      padding: "0.5rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#e5e7eb"
        : "white",
      color: state.isSelected ? "white" : "#374151",
    }),
    menu: (provided) => ({ ...provided, borderRadius: "0.375rem", zIndex: 20 }),
  };

  const isStreetDisabled = !formData.province || !formData.ward;

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* FORM */}
      <form onSubmit={handleAddOrUpdate} className="space-y-4 mb-8">
        <PhoneNumberField
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
        <ProvinceSelect
          value={formData.province}
          options={provinces}
          onChange={handleSelectChange("province")}
          styles={customStyles}
        />
        <WardSelect
          value={formData.ward}
          options={wards}
          onChange={handleSelectChange("ward")}
          disabled={!formData.province}
          styles={customStyles}
        />
        <AddressLineInput
          value={formData.addressLine}
          onChange={handleInputChange}
          disabled={isStreetDisabled}
        />
        <DefaultCheckbox
          checked={formData.isDefault}
          onChange={handleInputChange}
        />

        <div className="flex flex-wrap">
          <Button
            type="submit"
            textContent={isEditing ? "Cập nhật" : "Thêm địa chỉ"}
            className="!mb-0" // Remove bottom margin for alignment
          />
          {isEditing && (
            <Button
              type="button"
              textContent="Tạo mới"
              onClick={handleResetForm}
              // Override Blue with Gray
              className="!bg-gray-500 hover:!bg-gray-600 !mb-0"
            />
          )}
        </div>
      </form>

      {/* LIST OF ADDRESSES (only in Profile) */}
      {showList && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="flex justify-between items-center p-4 border rounded-md bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {addr.phoneNumber}{" "}
                  {addr.isDefault && (
                    <span className="text-green-500 text-sm ml-1">
                      [Mặc định]
                    </span>
                  )}
                </p>
                <p className="text-gray-600">
                  {addr.addressLine}, {addr.ward}, {addr.province}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Kept as small text buttons for cleaner UI, 
                    or could be replaced with small Buttons if preferred */}
                <button
                  type="button"
                  onClick={() => handleEdit(addr)}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Xóa
                </button>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr._id)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Đặt mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;