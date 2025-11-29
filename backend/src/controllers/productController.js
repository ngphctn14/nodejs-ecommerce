import Product from "../models/productModel.js";
import Brand from "../models/brandModel.js";
import Category from "../models/categoryModel.js";
import ProductVariant from "../models/productVariantModel.js";

import {esClient} from "../elastic/esClient.js";

import mongoose from "mongoose";

export const getProductFilters = async (req, res) => {
  try {
    const variants = await ProductVariant.find({}, "attributes price");
    
    const colors = new Set();
    const sizes = new Set();
    let maxPrice = 0;

    variants.forEach(v => {
      if (v.attributes?.color) colors.add(v.attributes.color);
      if (v.attributes?.size) sizes.add(v.attributes.size);
      if (v.price > maxPrice) maxPrice = v.price;
    });

    res.json({
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort(),
      maxPrice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { 
      search, 
      categoryId, 
      brandId, 
      minPrice, 
      maxPrice, 
      color, 
      size, 
      sort 
    } = req.query;

    // --- 1. Build Variant Filter (Price, Color, Size) ---
    let variantQuery = {};

    if (minPrice || maxPrice) {
      variantQuery.price = {};
      if (minPrice) variantQuery.price.$gte = Number(minPrice);
      if (maxPrice) variantQuery.price.$lte = Number(maxPrice);
    }

    if (color) variantQuery["attributes.color"] = color;
    if (size) variantQuery["attributes.size"] = size;

    // Find matching variants to get product IDs
    const matchingVariants = await ProductVariant.find(variantQuery).select("productId");
    const productIdsFromVariants = matchingVariants.map(v => v.productId);

    // --- 2. Build Product Filter ---
    let matchStage = {};

    if (minPrice || maxPrice || color || size) {
      matchStage._id = { $in: productIdsFromVariants };
    }

    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    if (categoryId) {
      matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    if (brandId) {
      matchStage.brandId = new mongoose.Types.ObjectId(brandId);
    }

    // --- 3. Sorting ---
    let sortStage = {};
    switch (sort) {
      case "priceLowToHigh":
        sortStage = { basePrice: 1 };
        break;
      case "priceHighToLow":
        sortStage = { basePrice: -1 };
        break;
      case "newest":
        sortStage = { createdAt: -1 };
        break;
      case "bestSelling":
        sortStage = { sales: -1 };
        break;
      default:
        sortStage = { createdAt: -1 };
    }

    // --- 4. Aggregation Pipeline ---
    const products = await Product.aggregate([
      // A. Match
      { $match: matchStage },

      // B. Lookup Images
      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },

      // C. Add imageUrl
      {
        $addFields: {
          imageUrl: { $arrayElemAt: ["$images.url", 0] },
        },
      },

      // D. Lookup Variants
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      // E. Lookup Category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDoc"
        }
      },
      { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },

      // F. Lookup Brand
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brandDoc"
        }
      },
      { $unwind: { path: "$brandDoc", preserveNullAndEmptyArrays: true } },

      // G. Clean Output
      {
        $project: {
          images: 0,
          "categoryDoc._id": 0,
          "brandDoc._id": 0,
        },
      },

      // H. Sort
      { $sort: sortStage }
    ]);

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });

    const products = await Product.aggregate([
      { $match: { categoryId: category._id } },

      // --- Add Variants ---
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      // --- Brand ---
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$brand" },

      // --- Category ---
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // --- Images ---
      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },
      {
        $addFields: {
          imageUrl: { $arrayElemAt: ["$images.url", 0] },
        },
      },

      {
        $project: {
          images: 0,
        },
      },
    ]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProductsByBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand)
      return res.status(404).json({ message: "Không tìm thấy nhãn hàng" });

    const products = await Product.aggregate([
      { $match: { brandId: brand._id } },

      // --- Add Variants ---
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      // --- Brand ---
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: "$brand" },

      // --- Category ---
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // --- Images ---
      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },
      {
        $addFields: {
          imageUrl: { $arrayElemAt: ["$images.url", 0] },
        },
      },

      {
        $project: {
          images: 0,
        },
      },
    ]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }

    const aggregationPipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "brands", 
          localField: "brandId",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      {
        $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },
      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          originalPrice: "$basePrice",
          discountPercent: 1,
          brand: "$brandDetails.name",
          images: "$images.url",
          variants: {
            $map: {
              input: "$variants",
              as: "v",
              in: {
                _id: "$$v._id",
                sku: "$$v.sku",
                price: "$$v.price",
                stock: "$$v.stock", 
                size: "$$v.attributes.size",
                color: "$$v.attributes.color",
              },
            },
          },
        },
      },
    ];

    const productArray = await Product.aggregate(aggregationPipeline);

    if (!productArray.length) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const product = productArray[0];
    const finalPrice = Math.round(
      product.originalPrice * (1 - product.discountPercent / 100)
    );

    const formattedProduct = {
      ...product,
      basePrice: finalPrice,
      oldPrice: product.originalPrice,
    };
    delete formattedProduct.originalPrice; 

    res.json(formattedProduct);

  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Sản phẩm được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, sort } = req.query;
    if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });

    let sortStage = {};
    switch (sort) {
      case "price_asc":
        sortStage = { price: 1 };
        break;
      case "price_desc":
        sortStage = { price: -1 };
        break;
      case "name_asc":
        sortStage = { name: 1 };
        break;
      case "name_desc":
        sortStage = { name: -1 };
        break;
      default:
        sortStage = { createdAt: -1 };
    }

    // Search ES for matching product IDs
    const esResult = await esClient.search({
      index: "products",
      query: {
        multi_match: {
          query: q,
          fields: ["name", "description"],
          fuzziness: "AUTO",
        },
      },
      size: 50
    });

    const productIds = esResult.hits.hits.map(hit => hit._id);
    if (!productIds.length) return res.json([]);

    const matchStage = { _id: { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) } };

    const products = await Product.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },

      {
        $addFields: {
          imageUrl: { $arrayElemAt: ["$images.url", 0] },
        },
      },

      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDoc"
        }
      },
      { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brandDoc"
        }
      },
      { $unwind: { path: "$brandDoc", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          images: 0,
          "categoryDoc._id": 0,
          "brandDoc._id": 0,
        },
      },

      { $sort: sortStage }
    ]);

    // Preserve ES order
    const productsMap = {};
    products.forEach(p => { productsMap[p._id.toString()] = p; });
    const sortedProducts = productIds.map(id => productsMap[id]).filter(Boolean);

    res.json(sortedProducts);

  } catch (err) {
    console.error("[Search Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 16;

    const products = await Product.aggregate([
      { $sort: { sales: -1 } }, 
      
      { $limit: limit },

      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          oldPrice: "$basePrice", 
          salePercent: "$discountPercent",
          imageUrl: { $arrayElemAt: ["$images.url", 0] },
          price: {
            $round: [
              {
                $multiply: [
                  "$basePrice",
                  { $subtract: [1, { $divide: ["$discountPercent", 100] }] },
                ],
              },
              0, 
            ],
          },
        },
      },
    ]);

    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      salePercent: product.salePercent,
      imageUrl: product.imageUrl || "/default-product.png", 
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Lỗi lấy sản phẩm nổi bật:", error);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm bán chạy" });
  }
};

export const getMostDiscountProduct = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 16;

    const products = await Product.aggregate([
      { $match: { discountPercent: { $gt: 0 } } },

      { $sort: { discountPercent: -1 } },

      { $limit: limit },

      {
        $lookup: {
          from: "productimages",
          localField: "_id",
          foreignField: "productId",
          as: "images",
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          oldPrice: "$basePrice", 
          salePercent: "$discountPercent", 
          imageUrl: { $arrayElemAt: ["$images.url", 0] }, 
          price: {
            $round: [
              {
                $multiply: [
                  "$basePrice",
                  { $subtract: [1, { $divide: ["$discountPercent", 100] }] },
                ],
              },
              0, 
            ],
          },
        },
      },
    ]);

    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,       
      oldPrice: product.oldPrice, 
      salePercent: product.salePercent,
      imageUrl: product.imageUrl || "/default-product.png",
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Lỗi lấy sản phẩm giảm giá nhiều nhất:", error);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm giảm giá" });
  }
};