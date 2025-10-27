import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import Brand from "../models/brandModel.js";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import ProductVariant from "../models/productVariantModel.js";
import ProductImage from "../models/productImageModel.js";

dotenv.config();

const MONGO_URI = process.env.ATLAS_URI;

// 🖼️ Hàm tạo ảnh phù hợp với loại sản phẩm
function getSportsImage(categoryName) {
  const keywords = {
    "Giày đá bóng": "football+boots",
    "Áo đấu": "football+jersey",
    "Quần đá bóng": "football+shorts",
    "Bóng đá": "football+ball",
    "Găng tay thủ môn": "goalkeeper+gloves",
    "Phụ kiện bóng đá": "football+accessories",
  };
  const tag = keywords[categoryName] || "football";
  return `https://loremflickr.com/800/800/${tag}`;
}

// ⚽ Mô tả tiếng Việt liên quan đến bóng đá
function getFootballDescription(categoryName) {
  const descriptions = {
    "Giày đá bóng": [
      "Đôi giày nhẹ và bám sân, giúp bạn kiểm soát bóng tối đa trên mọi mặt sân.",
      "Thiết kế chuyên dụng cho cầu thủ, mang lại cảm giác thoải mái và ổn định khi thi đấu.",
      "Chất liệu cao cấp, bền bỉ, hỗ trợ khả năng tăng tốc và dứt điểm chính xác.",
    ],
    "Áo đấu": [
      "Áo thi đấu thoáng khí, giúp bạn luôn mát mẻ trong suốt 90 phút.",
      "Thiết kế thể thao hiện đại, phù hợp cho cả luyện tập và thi đấu.",
      "Chất liệu co giãn, thấm hút mồ hôi tốt, mang lại cảm giác dễ chịu.",
    ],
    "Quần đá bóng": [
      "Quần đá bóng thoải mái, linh hoạt cho mọi chuyển động trên sân.",
      "Chất liệu nhẹ, giúp bạn tự tin di chuyển nhanh và chính xác.",
      "Thiết kế chuyên nghiệp dành cho các cầu thủ bóng đá phong trào và chuyên nghiệp.",
    ],
    "Bóng đá": [
      "Bóng đạt tiêu chuẩn thi đấu FIFA, mang lại cảm giác chạm bóng chân thực.",
      "Đường khâu chắc chắn, độ nảy ổn định, phù hợp cho cả sân cỏ và sân cứng.",
      "Bề mặt bóng bền bỉ, chống thấm nước, lý tưởng cho mọi điều kiện thời tiết.",
    ],
    "Găng tay thủ môn": [
      "Găng tay có lớp đệm dày, bảo vệ tay khi bắt bóng tốc độ cao.",
      "Thiết kế chống trơn trượt, giúp bạn kiểm soát bóng tốt hơn trong khung thành.",
      "Cổ tay co giãn, ôm sát, dễ dàng tháo lắp và cực kỳ thoải mái.",
    ],
    "Phụ kiện bóng đá": [
      "Tất thể thao chất lượng cao, co giãn tốt, thấm hút mồ hôi.",
      "Bảo vệ ống đồng nhẹ, bền và ôm sát chân khi thi đấu.",
      "Túi đựng đồ bóng đá đa năng, tiện lợi khi di chuyển.",
    ],
  };

  const options = descriptions[categoryName] || ["Sản phẩm bóng đá chất lượng cao."];
  return faker.helpers.arrayElement(options);
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Promise.all([
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      ProductVariant.deleteMany({}),
      ProductImage.deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // 👟 Thêm thương hiệu với mô tả
    const brandData = [
      {
        name: "Nike",
        description:
          "Nike là thương hiệu thể thao hàng đầu thế giới, nổi tiếng với công nghệ tiên tiến và thiết kế hiện đại.",
      },
      {
        name: "Adidas",
        description:
          "Adidas mang đến những sản phẩm thể thao chất lượng cao, kết hợp giữa phong cách và hiệu suất thi đấu.",
      },
      {
        name: "Puma",
        description:
          "Puma nổi bật với sự năng động, sáng tạo và phong cách trẻ trung cho người yêu thể thao.",
      },
      {
        name: "Mizuno",
        description:
          "Mizuno là thương hiệu Nhật Bản nổi tiếng với chất lượng vượt trội và sự thoải mái khi sử dụng.",
      },
      {
        name: "Under Armour",
        description:
          "Under Armour tập trung vào công nghệ hiệu suất cao, mang lại sự linh hoạt và thoáng mát cho người chơi.",
      },
      {
        name: "New Balance",
        description:
          "New Balance kết hợp giữa công nghệ tiên tiến và sự thoải mái, hỗ trợ tốt cho các vận động viên chuyên nghiệp.",
      },
    ];

    const brands = await Brand.insertMany(brandData);
    console.log(`🏷️ Inserted ${brands.length} brands`);

    // 🏆 Danh mục
    const categoriesData = [
      { name: "Giày đá bóng", description: "Giày đá bóng chính hãng, bám sân tốt và thoải mái." },
      { name: "Áo đấu", description: "Áo thi đấu chính hãng, thoáng khí và bền đẹp." },
      { name: "Quần đá bóng", description: "Quần thể thao linh hoạt, phù hợp cho thi đấu." },
      { name: "Bóng đá", description: "Bóng đạt chuẩn thi đấu, độ nảy ổn định." },
      { name: "Găng tay thủ môn", description: "Găng tay chất lượng cao, bảo vệ bàn tay tối đa." },
      { name: "Phụ kiện bóng đá", description: "Phụ kiện hỗ trợ tập luyện và thi đấu hiệu quả." },
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`📂 Inserted ${categories.length} categories`);

    // ⚽ Thêm sản phẩm
    const products = [];
    for (let i = 0; i < 20; i++) {
      const category = faker.helpers.arrayElement(categories);
      const brand = faker.helpers.arrayElement(brands);

      const name = `${brand.name} ${category.name} ${faker.helpers.arrayElement([
        "Pro",
        "Elite",
        "X",
        "Superfly",
        "Phantom",
        "Mercurial",
      ])}`;

      const basePrice = faker.number.int({ min: 400000, max: 3500000 });

      const product = new Product({
        categoryId: category._id,
        brandId: brand._id,
        name,
        description: getFootballDescription(category.name),
        basePrice,
        sales: faker.number.int({ min: 0, max: 200 }),
        discountPercent: Math.random() > 0.5 ? faker.number.int({ min: 5, max: 30 }) : 0,
      });

      products.push(product);
    }

    const createdProducts = await Product.insertMany(products);
    console.log(`🛒 Inserted ${createdProducts.length} products`);

    // 🎽 Biến thể sản phẩm
    const variants = [];
    for (const product of createdProducts) {
      const numVariants = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < numVariants; i++) {
        variants.push({
          productId: product._id,
          sku: faker.string.alphanumeric(10).toUpperCase(),
          price: faker.number.int({
            min: product.basePrice,
            max: product.basePrice + 400000,
          }),
          stock: faker.number.int({ min: 10, max: 50 }),
          attributes: {
            color: faker.color.human(),
            size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
          },
        });
      }
    }

    const createdVariants = await ProductVariant.insertMany(variants);
    console.log(`🎯 Inserted ${createdVariants.length} product variants`);

    // 🖼️ Ảnh sản phẩm
    const images = [];
    for (const product of createdProducts) {
      const category = categories.find((c) => c._id.equals(product.categoryId));
      for (let i = 0; i < 2; i++) {
        images.push({
          productId: product._id,
          url: getSportsImage(category.name),
          alt: `${product.name} - ảnh ${i + 1}`,
        });
      }
    }

    await ProductImage.insertMany(images);
    console.log(`🖼️ Inserted ${images.length} product images`);

    console.log("✅ Database seeded successfully with football-themed data!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

seedDatabase();
