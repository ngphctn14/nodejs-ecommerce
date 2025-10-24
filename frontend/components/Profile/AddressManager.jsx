import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosClient from '../../api/axiosClient';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    phoneNumber: '',
    province: '',
    ward: '',
    addressLine: '',
    isDefault: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [rawAddressData, setRawAddressData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/vn_only_simplified_json_generated_data_vn_units.json')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải file JSON');
        return res.json();
      })
      .then((data) => {
        const formattedProvinces = data.map((prov) => prov.FullName);
        setProvinces(formattedProvinces);
        setRawAddressData(data);
      })
      .catch((err) => {
        console.error('Lỗi tải dữ liệu địa chỉ:', err);
        setError('Không thể tải dữ liệu địa chỉ');
      });

    // Tải danh sách địa chỉ từ API
    const fetchAddresses = async () => {
      try {
        const response = await axiosClient.get('/addresses');
        setAddresses(response.data);
      } catch (error) {
        console.error('Lỗi khi gọi API lấy địa chỉ:', error);
        setError('Không thể tải danh sách địa chỉ');
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (formData.province && rawAddressData) {
      const rawProvince = rawAddressData.find((prov) => prov.FullName === formData.province);
      const formattedWards = rawProvince?.Wards.map((ward) => ward.FullName) || [];
      setWards(formattedWards);
      if (!isEditing) {
        setFormData((prev) => ({ ...prev, ward: '' }));
      }
    } else {
      setWards([]);
      if (!isEditing) {
        setFormData((prev) => ({ ...prev, ward: '' }));
      }
    }
  }, [formData.province, rawAddressData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSelectChange = (name) => (selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const newAddress = {
      ...formData,
    };

    try {
      if (isEditing) {
        const response = await axiosClient.put(`/addresses/${formData.id}`, newAddress);
        setAddresses(addresses.map((addr) => (addr.id === formData.id ? response.data : addr)));
        setIsEditing(false);
      } else {
        const response = await axiosClient.post('/addresses', newAddress);
        setAddresses([...addresses, response.data]);
      }

      setFormData({
        id: null,
        phoneNumber: '',
        province: '',
        ward: '',
        addressLine: '',
        isDefault: false,
      });
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error);
      setError('Không thể lưu địa chỉ. Vui lòng thử lại.');
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setIsEditing(true);
    setError(null);
    if (address.province && rawAddressData) {
      const rawProvince = rawAddressData.find((prov) => prov.FullName === address.province);
      const formattedWards = rawProvince?.Wards.map((ward) => ward.FullName) || [];
      setWards(formattedWards);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axiosClient.delete(`/addresses/${id}`);
      setAddresses(addresses.filter((addr) => addr.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      setError('Không thể xóa địa chỉ. Vui lòng thử lại.');
    }
  };

  const handleSetDefault = async (id) => {
    setError(null);
    try {
      await axiosClient.put(`/addresses/${id}/set-default`);
      setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })));
    } catch (error) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', error);
      setError('Không thể đặt địa chỉ mặc định. Vui lòng thử lại.');
    }
  };

  const handleResetForm = () => {
    setFormData({
      id: null,
      phoneNumber: '',
      province: '',
      ward: '',
      addressLine: '',
      isDefault: false,
    });
    setIsEditing(false);
    setWards([]);
    setError(null);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      padding: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
      '&:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: '#e5e7eb',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.375rem',
      zIndex: 20,
    }),
  };

  const isStreetDisabled = !formData.province || !formData.ward;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddOrUpdate} className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-700 font-medium">Số điện thoại</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Tỉnh/Thành phố</label>
          <Select
            name="province"
            value={provinces.find((p) => p === formData.province) ? { value: formData.province, label: formData.province } : null}
            onChange={handleSelectChange('province')}
            options={provinces.map((p) => ({ value: p, label: p }))}
            isSearchable
            placeholder="-- Chọn tỉnh/thành phố --"
            styles={customStyles}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Phường/Xã</label>
          <Select
            name="ward"
            value={wards.find((w) => w === formData.ward) ? { value: formData.ward, label: formData.ward } : null}
            onChange={handleSelectChange('ward')}
            options={wards.map((w) => ({ value: w, label: w }))}
            isSearchable
            placeholder="-- Chọn phường/xã --"
            isDisabled={!formData.province}
            styles={customStyles}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Số nhà, tên đường</label>
          <input
            type="text"
            name="addressLine"
            value={formData.addressLine}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isStreetDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Nhập số nhà, tên đường"
            disabled={isStreetDisabled}
            required
          />
          {isStreetDisabled && (
            <p className="text-sm text-gray-500 mt-1">
              Vui lòng chọn tỉnh/thành phố và phường/xã trước khi nhập số nhà, tên đường.
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-gray-700">Đặt làm địa chỉ mặc định</label>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isEditing ? 'Cập nhật' : 'Thêm địa chỉ'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleResetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Tạo mới
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex justify-between items-center p-4 border rounded-md bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-800">
                {addr.phoneNumber} - {addr.address}{' '}
                {addr.isDefault && <span className="text-green-500 text-sm">[Mặc định]</span>}
              </p>
              <p className="text-gray-600">
                {addr.addressLine}, {addr.ward}, {addr.province}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-500 hover:text-blue-700"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Đặt mặc định
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressManager;