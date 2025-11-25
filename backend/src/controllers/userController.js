import User from "../models/userModel.js";

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      
      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
export const changeUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: "Đổi mật khẩu thành công" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.banned = true;
      await user.save();
      res.json({ message: "Đã cấm người dùng này" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.banned = false;
      await user.save();
      res.json({ message: "Đã bỏ cấm người dùng này" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role } = req.body;

    const user = await User.findById(id);

    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      
      if (role && ["user", "admin"].includes(role)) {
        user.role = role;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        banned: updatedUser.banned 
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeBanStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { banned } = req.body; 

        const user = await User.findById(id);

        if (user) {
            if (typeof banned !== 'undefined') {
                user.banned = banned;
                const updatedUser = await user.save();
                
                res.json({
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    banned: updatedUser.banned,
                    message: updatedUser.banned ? "Đã cấm người dùng" : "Đã bỏ cấm người dùng"
                });
            } else {
                res.status(400).json({ message: "Vui lòng gửi trạng thái banned (true/false)" });
            }
        } else {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

