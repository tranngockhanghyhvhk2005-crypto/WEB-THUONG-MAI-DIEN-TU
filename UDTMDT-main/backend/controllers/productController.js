const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const Brand = require('../models/Brand.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');

// --- 1. LẤY TẤT CẢ SẢN PHẨM ---
const getAllProducts = async (req, res) => {
  try {
    const {
      search, category, brand, rating,
      price_from, price_to, price_min, price_max,
      page, limit, status
    } = req.query;

    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skipCount = (currentPage - 1) * pageSize;

    const matchStage = {};

    // 1. Lọc theo Tên & Trạng thái
    if (search) matchStage.name = { $regex: search, $options: 'i' };
    if (status) matchStage.status = status;

    // 2. Lọc theo Danh mục
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        matchStage.category = new mongoose.Types.ObjectId(category);
      } else {
        const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
        if (categoryDoc) matchStage.category = categoryDoc._id;
        else return res.status(200).json({ message: 'Success', data: [], total: 0 });
      }
    }

    if (brand) {
      // Chuyển brand thành mảng
      const brandList = Array.isArray(brand) ? brand : [brand];

      const brandIds = [];
      const brandNames = [];

      // Phân loại: Cái nào là ID, cái nào là Tên
      brandList.forEach(b => {
        if (mongoose.Types.ObjectId.isValid(b)) {
          brandIds.push(new mongoose.Types.ObjectId(b));
        } else {
          brandNames.push(new RegExp(b, 'i'));
        }
      });

      // Nếu có tìm theo Tên -> Tìm ID của các brand đó gộp vào danh sách ID
      if (brandNames.length > 0) {
        const foundBrands = await Brand.find({ name: { $in: brandNames } });
        const foundIds = foundBrands.map(b => b._id);
        brandIds.push(...foundIds);
      }

      // Dùng toán tử $in để tìm sản phẩm thuộc danh sách ID này
      if (brandIds.length > 0) {
        matchStage.brand = { $in: brandIds };
      }
    }

    // 4. Lọc theo Rating
    if (rating) {
      const rate = Number(rating);
      if (rate === 3) {
        matchStage.rating = { $lte: 3 };
      }
      else { 
      matchStage.rating = { 
        $gte: rate,
        $lt: rate + 1
       };
      }
    }

    // 5. Lọc theo GIÁ
    const min = Number(price_from) || Number(price_min) || 0;
    const max = Number(price_to) || Number(price_max) || 0;

    if (min > 0 || max > 0) {
      const priceCondition = {};
      if (min > 0) priceCondition.$gte = min;
      if (max > 0) priceCondition.$lte = max;

      matchStage.$or = [
        { price: priceCondition },
        {
          flashSalePrice: { ...priceCondition, $gt: 0 }
        }
      ];
    }

    // Pipeline Aggregate
    const pipeline = [
      { $match: matchStage },
      // Lookup Category
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      // Lookup Brand
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandData'
        }
      },
      { $unwind: { path: '$brandData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          category: '$categoryData',
          brand: '$brandData'
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skipCount }, { $limit: pageSize }],
          totalCount: [{ $count: 'count' }]
        }
      }
    ];

    const result = await Product.aggregate(pipeline);
    const products = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return res.status(200).json({
      message: 'Thành công',
      data: products,
      total,
      currentPage,
      pageSize
    });
  } catch (error) {
    console.error("Lỗi filter sản phẩm:", error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
// --- 2. LẤY CHI TIẾT SẢN PHẨM ---
const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id
    if (!productId) {
      return res.status(200).json({ status: 'ERR', message: 'The productId is required' })
    }

    const product = await Product.findById(productId).populate('brand');

    if (!product) {
      return res.status(404).json({ status: 'ERR', message: 'Product not found' })
    }
    res.status(200).json({ status: 'OK', data: product })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}


// --- 3. TẠO SẢN PHẨM ---
const createProduct = async (req, res) => {
  try {
    const {
      name, description, category, brand,
      isFlashSale, countInStock, price, variants
    } = req.body;

    // 1. Xử lý Album ảnh chung
    let rootPrice = Number(req.body.price) || 0;
    let rootFlashSalePrice = Number(req.body.flashSalePrice) || 0;
    let rootCountInStock = Number(req.body.countInStock) || 0;

    let imageObjects = [];
    if (req.files && req.files['images']) {
      imageObjects = req.files['images'].map(file => `/uploads/product-img/${file.filename}`);
    }

    // 2. Xử lý Variants và Ảnh Biến thể (ĐOẠN QUAN TRỌNG ĐÃ FIX)
    let finalVariants = [];
    if (variants) {
      try {
        const rawVariants = JSON.parse(variants);
        const variantFiles = req.files && req.files['variantImages'] ? req.files['variantImages'] : [];
        let imgIndex = 0;

        // Map lại dữ liệu để đảm bảo lấy đúng trường flashSalePrice
        finalVariants = rawVariants.map(variant => {
          let variantImage = variant.image; // Mặc định là null hoặc ảnh cũ nếu có logic đó

          // Nếu có upload ảnh mới cho variant này
          if (variant.hasImage && variantFiles[imgIndex]) {
            variantImage = `/uploads/variants-img/${variantFiles[imgIndex].filename}`;
            imgIndex++;
          }

          return {
            name: variant.name,
            price: Number(variant.price),
            countInStock: Number(variant.countInStock),
            image: variantImage,
            flashSalePrice: Number(variant.flashSalePrice) || 0
          };
        });

        if (finalVariants.length > 0) {
          rootCountInStock = finalVariants.reduce((acc, curr) => acc + curr.countInStock, 0);

          if (isFlashSale === 'true' || isFlashSale === true) {
            const bestSaleVariant = finalVariants
              .filter(v => v.flashSalePrice > 0)
              .sort((a, b) => a.flashSalePrice - b.flashSalePrice)[0];

            if (bestSaleVariant) {
              rootFlashSalePrice = bestSaleVariant.flashSalePrice;
              rootPrice = bestSaleVariant.price;
            } else {
              rootFlashSalePrice = 0;
              rootPrice = Math.min(...finalVariants.map(v => v.price));
            }
          } else {
            rootPrice = Math.min(...finalVariants.map(v => v.price));
            rootFlashSalePrice = 0;
          }
        }
      } catch (e) {
        console.error("Lỗi parse variants:", e);
      }
    }

    // 3. Tính tổng kho
    let totalStock = Number(countInStock) || 0;
    if (finalVariants.length > 0) {
      totalStock = finalVariants.reduce((acc, curr) => acc + Number(curr.countInStock || 0), 0);
    }

    // 4. Tạo Object Product
    const product = new Product({
      name,
      price: Number(price) || 0,
      description,
      category,
      brand,
      countInStock: totalStock,
      images: imageObjects,
      image: imageObjects[0] || '',

      variants: finalVariants,
      price: rootPrice,
      countInStock: rootCountInStock,
      isFlashSale: isFlashSale === 'true' || isFlashSale === true,
      flashSalePrice: rootFlashSalePrice,
      user: req.user ? req.user._id : null
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Tạo thành công', product: createdProduct });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại' });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// --- 4. CẬP NHẬT SẢN PHẨM ---
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const {
      name, description, category, brand,
      isFlashSale, variants, status, existingImages
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (status) product.status = status;

    if (isFlashSale !== undefined) product.isFlashSale = isFlashSale === 'true' || isFlashSale === true;

    // Xử lý Variants
    if (variants) {
      try {
        const rawVariants = JSON.parse(variants);
        const variantFiles = req.files && req.files['variantImages'] ? req.files['variantImages'] : [];
        let imgIndex = 0;

        const processedVariants = rawVariants.map(variant => {
          let currentImage = variant.image;
          if (variant.hasImage && variantFiles[imgIndex]) {
            currentImage = `/uploads/variants-img/${variantFiles[imgIndex].filename}`;
            imgIndex++;
          }
          return {
            name: variant.name,
            price: Number(variant.price),
            countInStock: Number(variant.countInStock),
            image: currentImage,
            flashSalePrice: Number(variant.flashSalePrice) || 0
          };
        });

        product.variants = processedVariants;

        if (processedVariants.length > 0) {
          product.countInStock = processedVariants.reduce((acc, curr) => acc + curr.countInStock, 0);

          if (product.isFlashSale) {
            const bestSaleVariant = processedVariants
              .filter(v => v.flashSalePrice > 0)
              .sort((a, b) => a.flashSalePrice - b.flashSalePrice)[0];

            if (bestSaleVariant) {
              product.flashSalePrice = bestSaleVariant.flashSalePrice;
              product.price = bestSaleVariant.price;
            } else {
              product.flashSalePrice = 0;
              product.price = Math.min(...processedVariants.map(v => v.price));
            }
          } else {
            product.price = Math.min(...processedVariants.map(v => v.price));
            product.flashSalePrice = 0;
          }
        } else {
          if (req.body.price) product.price = Number(req.body.price);
          if (req.body.countInStock) product.countInStock = Number(req.body.countInStock);
          if (req.body.flashSalePrice) product.flashSalePrice = Number(req.body.flashSalePrice);
        }

      } catch (e) {
        console.error("Lỗi parse update variants", e);
      }
    }

    // Xử lý Ảnh Chung
     let finalImages = [];
    if (existingImages) {
      try { finalImages = JSON.parse(existingImages); } catch (e) { finalImages = product.images; }
    }
    
    if (req.files && req.files['images']) { 
       const newFiles = req.files['images'] || [];
       const newImageUrls = newFiles.map(file => `/uploads/product-img/${file.filename}`);
       finalImages = [...finalImages, ...newImageUrls];
    }
    product.images = finalImages;
    if (finalImages.length > 0) {
        product.image = finalImages[0];
    }

    await product.save();
    res.status(200).json({ status: 'OK', message: 'Cập nhật thành công', data: product });
  } catch (error) {
    console.error("Lỗi update:", error);
    res.status(500).json({ status: 'ERR', message: 'Lỗi server', error: error.message });
  }
};

// --- XÓA SẢN PHẨM ---
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// --- TẠO ĐÁNH GIÁ SẢN PHẨM ---
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
      }

      const review = {
        name: req.user.name || req.user.firstName || 'User',
        rating: Number(rating),
        comment,
        user: req.user.id,
        avatar: req.user.avatar
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// --- CHỨC NĂNG YÊU THÍCH (Logic Toggle) ---
const addToWishlist = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const userId = req.user.id; // Lấy từ middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyAdded = user.wishlist.find((idString) => idString.toString() === id);

    let updatedUser;

    if (alreadyAdded) {
      // Xóa (Un-like) -> Thêm { new: true } để trả về dữ liệu mới
      updatedUser = await User.findByIdAndUpdate(userId, {
        $pull: { wishlist: id },
      }, { new: true }); 

      res.status(200).json({
        status: 'OK',
        message: 'Đã xóa khỏi yêu thích',
        action: 'removed',
        data: updatedUser 
      });
    } else {
      // Thêm (Like) 
      updatedUser = await User.findByIdAndUpdate(userId, {
        $push: { wishlist: id },
      }, { new: true }); 

      res.status(200).json({
        status: 'OK',
        message: 'Đã thêm vào yêu thích',
        action: 'added',
        data: updatedUser 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllProductsPublic = getAllProducts;
const getProductByIdPublic = getDetailsProduct;

module.exports = {
  getAllProducts,
  getDetailsProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  addToWishlist,
  getAllProductsPublic,
  getProductByIdPublic
};