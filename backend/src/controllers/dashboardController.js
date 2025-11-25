import User from "../models/userModel.js";
import Order from "../models/orderModel.js"
import OrderItem from "../models/orderItemModel.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, newUsers, totalOrders, revenueResult] = await Promise.all([
      
      User.countDocuments({ role: "customer" }),

      User.countDocuments({ 
        role: "customer",
        createdAt: { $gte: startOfMonth } 
      }),

      Order.countDocuments({ status: { $ne: "cancelled" } }),

      Order.aggregate([
        { 
          $match: { 
            payment_status: { $eq: "paid" }
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: "$total_price" } 
          } 
        }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const metrics = {
      totalUsers,
      newUsers,
      totalOrders,
      totalRevenue,
    };

    res.status(200).json(metrics);

  } catch (error) {
    console.error("Lỗi lấy metrics dashboard:", error);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu thống kê" });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await OrderItem.aggregate([
      {
        $lookup: {
          from: "orders", 
          localField: "order_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },

      { 
        $match: { 
          "order.status": "confirmed" 
        } 
      },

      {
        $lookup: {
          from: "productvariants", 
          localField: "product_variant_id",
          foreignField: "_id",
          as: "variant"
        }
      },
      { $unwind: "$variant" },

      {
        $group: {
          _id: "$variant.productId",
          totalSales: { $sum: "$quantity" }, 
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      },

      { $sort: { totalSales: -1 } }, 
      { $limit: 5 },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },

      {
        $project: {
          _id: 0,
          name: "$productInfo.name",
          sales: "$totalSales",
          revenue: "$totalRevenue"
        }
      }
    ]);

    const formattedResponse = topProducts.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      sales: item.sales,
      revenue: item.revenue
    }));

    res.json(formattedResponse);

  } catch (error) {
    console.error("Lỗi lấy top sản phẩm:", error);
    res.status(500).json({ message: "Lỗi Server khi thống kê sản phẩm" });
  }
};


export const getRevenueChartData = async (req, res) => {
  try {
    let { month, year } = req.query;
    const currentDate = new Date();
    
    month = month ? parseInt(month) : currentDate.getMonth() + 1;
    year = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const rawData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: "cancelled" } 
        }
      },
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "order_id",
          as: "items"
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" } },
          dailyRevenue: { $sum: "$total_price" },
          dailyOrders: { $sum: 1 },
          dailyProducts: { $sum: { $sum: "$items.quantity" } }
        }
      }
    ]);

    const daysInMonth = new Date(year, month, 0).getDate(); 
    
    const fullMonthData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      
      const dataFound = rawData.find(item => item._id.day === day);

      if (dataFound) {
        const estimatedProfit = dataFound.dailyRevenue; 
        
        fullMonthData.push({
          date: `${day}/${month}`,
          revenue: dataFound.dailyRevenue,
          profit: Math.round(estimatedProfit),
          orders: dataFound.dailyOrders,
          products: dataFound.dailyProducts
        });
      } else {
        fullMonthData.push({
          date: `${day}/${month}`,
          revenue: 0,
          profit: 0,
          orders: 0,
          products: 0
        });
      }
    }

    res.status(200).json(fullMonthData);

  } catch (error) {
    console.error("Lỗi biểu đồ doanh thu:", error);
    res.status(500).json({ message: error.message });
  }
};