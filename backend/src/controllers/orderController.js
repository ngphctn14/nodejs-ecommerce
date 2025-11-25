import Order from "../models/orderModel.js";
import { sendOrderSuccessEmail } from "../config/mailer.js";
import User from "../models/userModel.js";
import OrderItem from "../models/orderItemModel.js";
import DiscountCode from "../models/discountCodeModel.js";
import Address from "../models/addressModel.js";
import Product from "../models/productModel.js"; 
import ProductVariant from "../models/productVariantModel.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Không được phép" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user_id: req.user.id })
      .populate("address_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user_id: req.user.id });
    const totalPages = Math.ceil(totalOrders / limit);

    if (!orders) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }


    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);

    const user = await User.findById(order.user_id);

    await sendOrderSuccessEmail(user, order);

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Đơn hàng được xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "fullName email")
      .populate("address_id")
      .populate("discount_code_id")
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = orders.map((order) => order._id);
    const allOrderItems = await OrderItem.find({ order_id: { $in: orderIds } })
      .populate({
        path: "product_variant_id",
        populate: { path: "productId", select: "name" },
      })
      .lean();

    const formattedOrders = orders.map((order) => {
      const currentItems = allOrderItems.filter(
        (item) => item.order_id.toString() === order._id.toString()
      );

      const subtotal = currentItems.reduce((sum, item) => {
        const originalPrice = item.product_variant_id?.price || item.price; 
        return sum + originalPrice * item.quantity;
      }, 0);

      const formattedItems = currentItems.map((item) => {
        const variant = item.product_variant_id;
        const product = variant?.productId;

        return {
          name: product?.name || "Sản phẩm không tồn tại",
          variant: variant?.attributes
            ? {
                color: variant.attributes.color,
                size: variant.attributes.size,
              }
            : null,
          quantity: item.quantity,
          price: item.price, 
          originalPrice: variant?.price || item.price 
        };
      });

      const addrObj = order.address_id;
      const fullAddress = addrObj
        ? `${addrObj.addressLine}, ${addrObj.ward}, ${addrObj.province}`
        : "Địa chỉ đã bị xóa";
      
      const customerInfo = {
        fullName: order.user_id?.fullName || "Khách vãng lai",
        email: order.user_id?.email || "",
        phone: addrObj?.phoneNumber || "", 
      };

      const calculatedDiscount = subtotal - order.total_price;
      const discountAmount = calculatedDiscount > 0 ? calculatedDiscount : 0;

      const discountVal = order.discount_code_id?.discount_value || 0;

      return {
        id: order._id,
        customer: customerInfo,
        items: formattedItems,
        
        subtotal: subtotal,
        total: order.total_price, 
        
        discountCode: order.discount_code_id?.code || null,
        discountValue: discountVal,
        discountAmount: discountAmount,
        
        loyaltyPointsUsed: order.loyalty_points_used || 0,
        loyaltyPointsEarned: order.loyalty_points_earned || 0,
        
        status: order.status,
        paymentStatus: order.payment_status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        address: fullAddress,
      };
    });

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!status && !paymentStatus) {
      return res.status(400).json({ 
        message: "Phải cung cấp ít nhất một trong hai: status hoặc paymentStatus" 
      });
    }

    const updateData = {};
    if (status) {
      const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ["unpaid", "paid", "refunded"];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: "Trạng thái thanh toán không hợp lệ" });
      }
      updateData.payment_status = paymentStatus;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Update Order Error:", error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};