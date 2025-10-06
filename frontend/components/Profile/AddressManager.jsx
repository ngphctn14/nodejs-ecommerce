import React, { useState } from 'react';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Nguyễn Văn A', phone: '+84 123 456 789', address: '123 Đường Láng, Hà Nội', isDefault: true },
    { id: 2, name: 'Trần Thị B', phone: '+84 987 654 321', address: '456 Nguyễn Trãi, TP.HCM', isDefault: false },
  ]);

  const [formData, setFormData] = useState({ id: null, name: '', phone: '', address: '', isDefault: false });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Cập nhật địa chỉ
      setAddresses(addresses.map(addr => 
        addr.id === formData.id ? { ...formData } : addr
      ));
      setIsEditing(false);
    } else {
      // Thêm địa chỉ mới
      const newAddress = { ...formData, id: addresses.length + 1 };
      setAddresses([...addresses, newAddress]);
    }
    setFormData({ id: null, name: '', phone: '', address: '', isDefault: false });
  };

  const handleEdit = (address) => {
    setFormData(address);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý địa chỉ</h2>

      {/* Form nhập liệu */}
      <form onSubmit={handleAddOrUpdate} className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-700 font-medium">Họ tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập họ tên"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập địa chỉ"
            required
          />
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          {isEditing ? 'Cập nhật' : 'Thêm địa chỉ'}
        </button>
      </form>

      {/* Danh sách địa chỉ */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex justify-between items-center p-4 border rounded-md bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-800">{addr.name} {addr.isDefault && <span className="text-green-500 text-sm">[Mặc định]</span>}</p>
              <p className="text-gray-600">{addr.phone}</p>
              <p className="text-gray-600">{addr.address}</p>
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