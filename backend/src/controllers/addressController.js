import Address from "../models/addressModel.js";

export const createAddress = async (req, res) => {
  try {
    const { addressLine, province, ward, phoneNumber, isDefault } = req.body;
    const userId = req.user.id;

    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new Address({
      userId,
      phoneNumber,
      addressLine,
      province,
      ward,
      isDefault: isDefault || false,
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId }).sort({ isDefault: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Không tìm thấy người dùng"});
    }

    const address = await Address.findOne({ _id: id, userId });
    if (!address) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { addressLine, phoneNumber, province, ward, isDefault } = req.body;
    const userId = req.user.id;

    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId },
      { addressLine, phoneNumber, province, ward, isDefault },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await Address.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    res.json({ message: "Xóa địa chỉ thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const setDefault = async (req, res) => {
  try{
    const userId = req.user.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Thiếu addressId" });
    }
     await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );

     const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    res.status(200).json({
      message: "Cập nhật địa chỉ mặc định thành công",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ mặc định:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}

