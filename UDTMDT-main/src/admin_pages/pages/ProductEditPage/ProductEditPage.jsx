import React, { useState, useEffect } from 'react';
import { ProductAddHeader as WrapperHeader } from '../ProductAdd/style';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined, PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

// --- HÀM HELPER: Xử lý đường dẫn ảnh ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
  return `http://127.0.0.1:8080${imagePath}`;
};

const ProductEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- 1. STATE SẢN PHẨM ---
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: 5,
    category: '',
    brand: '',
    countInStock: '',
    discount: '',
    isFlashSale: false,
    flashSalePrice: '',
  });

  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [variants, setVariants] = useState([
    { name: '', price: '', flashSalePrice: '', countInStock: '', image: null, previewImage: '' }
  ]);

  // --- [LOGIC MỚI] TÍNH TOÁN GIÁ HIỂN THỊ TỰ ĐỘNG ---
  // Kiểm tra xem có đang dùng biến thể không (dựa trên dữ liệu thực tế)
  const hasVariants = variants.length > 0 && variants.some(v => v.name !== '');

  // Tìm giá gốc thấp nhất trong các biến thể đang nhập
  const minPriceDisplay = hasVariants
    ? Math.min(...variants.map(v => Number(v.price) || Infinity))
    : 0;
  const displayPrice = (minPriceDisplay === Infinity || minPriceDisplay === 0) ? '' : minPriceDisplay;

  // Tìm giá sale thấp nhất
  const minSaleDisplay = hasVariants
    ? Math.min(...variants.filter(v => Number(v.flashSalePrice) > 0).map(v => Number(v.flashSalePrice)))
    : 0;
  const displaySalePrice = (minSaleDisplay === Infinity || minSaleDisplay === 0) ? '' : minSaleDisplay;

  // Tính TỔNG TỒN KHO hiển thị
  const totalStockDisplay = hasVariants
    ? variants.reduce((acc, curr) => acc + (Number(curr.countInStock) || 0), 0)
    : stateProduct.countInStock;

  // --- 2. FETCH DỮ LIỆU ---
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const resCat = await apiService.get('/categories/get-all');
        const resBrand = await apiService.get('/brand/get-all');
        setCategories(resCat.data.data || []);
        setBrands(resBrand.data.data || []);

        const resProduct = await apiService.get(`/products/get-details/${id}`);
        const product = resProduct.data.data;

        if (product) {
          setStateProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            rating: product.rating,
            category: product.category?._id || product.category || '',
            brand: product.brand?._id || product.brand || '',
            countInStock: product.countInStock,
            discount: product.discount,
            isFlashSale: product.isFlashSale || false,
            flashSalePrice: product.flashSalePrice || 0,
          });

          // Fill Album ảnh
          if (product.images && product.images.length > 0) {
            const formattedImages = product.images.map((imgUrl, index) => ({
              uid: `-${index}`,
              name: `image-${index}`,
              status: 'done',
              url: getImageUrl(imgUrl),
              originalUrl: imgUrl
            }));
            setFileList(formattedImages);
          }

          // Fill Variants
          if (product.variants && product.variants.length > 0) {
            const formattedVariants = product.variants.map(v => ({
              ...v,
              flashSalePrice: v.flashSalePrice || 0,
              previewImage: getImageUrl(v.image) || '',
              image: v.image
            }));
            setVariants(formattedVariants);
          } else {
            // Nếu không có variant thì set mảng rỗng hoặc 1 dòng trống tùy logic
            setVariants([]);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Lỗi tải dữ liệu sản phẩm");
      }
    }
    fetchInitData();
  }, [id]);

  // --- HANDLERS ---
  const handleOnchange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setStateProduct({ ...stateProduct, [e.target.name]: value });
  };

  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // --- VARIANTS LOGIC ---
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleVariantImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newVariants = [...variants];
      newVariants[index].image = file;
      newVariants[index].previewImage = reader.result;
      setVariants(newVariants);
    };
    return false;
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', flashSalePrice: '', countInStock: '', image: null, previewImage: '' }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // --- SUBMIT UPDATE (VALIDATION MỚI) ---
  const handleUpdateProduct = async () => {
    // 1. Validate cơ bản
    if (!stateProduct.name || !stateProduct.category) {
      toast.error("Vui lòng điền tên và danh mục!");
      return;
    }

    // 2. Validate Giá (Logic thông minh)
    // Nếu KHÔNG có biến thể -> Bắt buộc nhập giá cha
    if (!hasVariants && !stateProduct.price) {
      toast.error("Vui lòng nhập giá sản phẩm!");
      return;
    }
    // Nếu CÓ biến thể -> Bắt buộc nhập giá cho tất cả biến thể
    if (hasVariants && variants.some(v => !v.price)) {
      toast.error("Vui lòng nhập giá gốc cho tất cả các biến thể!");
      return;
    }

    const formData = new FormData();

    formData.append('name', stateProduct.name);
    formData.append('description', stateProduct.description);
    formData.append('category', stateProduct.category);
    formData.append('brand', stateProduct.brand);

    // Nếu có biến thể -> Gửi 0 (Backend tự tính min)
    // Nếu không -> Gửi giá nhập tay
    formData.append('price', hasVariants ? 0 : stateProduct.price);
    formData.append('countInStock', stateProduct.countInStock || 0);

    formData.append('isFlashSale', stateProduct.isFlashSale);
    formData.append('flashSalePrice', hasVariants ? 0 : (stateProduct.flashSalePrice || 0));

    // 2. Xử lý ảnh Album
    const existingImages = [];
    if (fileList && fileList.length > 0) {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        } else if (file.originalUrl || file.url) {
          const urlToSave = file.originalUrl || file.url.replace('http://127.0.0.1:8080', '');
          existingImages.push(urlToSave);
        }
      });
    }
    formData.append('existingImages', JSON.stringify(existingImages));

    // 3. Xử lý Variants
    const variantsJson = variants.map((variant) => {
      const { image, previewImage, ...rest } = variant;
      if (image && image instanceof File) {
        formData.append('variantImages', image);
        return { ...rest, hasImage: true };
      }
      return { ...rest, image: typeof image === 'string' ? image : '', hasImage: false };
    });

    formData.append('variants', JSON.stringify(variantsJson));

    try {
      const res = await apiService.put(`/products/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'OK' || res.status === 200) {
        toast.success('Cập nhật thành công!');
        navigate('/admin/products');
      } else {
        toast.error(res.data.message || 'Lỗi cập nhật');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="d-flex align-items-center gap-3 mb-3">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/products')}
        >
          Quay lại
        </Button>
        <WrapperHeader style={{ margin: 0 }}>Chỉnh Sửa Sản Phẩm</WrapperHeader>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label>Tên sản phẩm</label>
            <input className="form-control" name="name" value={stateProduct.name} onChange={handleOnchange} />
          </div>

          {/* --- [GIAO DIỆN GIÁ THÔNG MINH] --- */}
          <div className="row">
            <div className="col-6 mb-3">
              <label className="fw-bold">Giá niêm yết (VND)</label>
              <input
                type="number"
                className={`form-control ${hasVariants ? 'bg-light' : ''}`}
                name="price"
                // Nếu có biến thể -> Hiển thị giá min tự tính. Nếu không -> Hiển thị giá nhập tay
                value={hasVariants ? displayPrice : stateProduct.price}
                onChange={handleOnchange}
                readOnly={hasVariants} // Khóa ô này nếu có biến thể
                placeholder="VD: 500000"
              />
              {hasVariants && <small className="text-primary fst-italic">*Tự động lấy giá thấp nhất từ biến thể</small>}
            </div>

            <div className="col-6 mb-3">
              <label className="fw-bold text-danger">Giá Flash Sale (VND)</label>
              <input
                type="number"
                className={`form-control border-danger ${hasVariants ? 'bg-light' : ''}`}
                name="flashSalePrice"
                value={hasVariants ? displaySalePrice : stateProduct.flashSalePrice}
                onChange={handleOnchange}
                // Khóa nếu tắt FlashSale HOẶC có biến thể
                readOnly={!stateProduct.isFlashSale || hasVariants}
                disabled={!stateProduct.isFlashSale && !hasVariants}
              />
              {hasVariants && stateProduct.isFlashSale && <small className="text-danger fst-italic">*Tự động lấy giá sale thấp nhất</small>}
            </div>
          </div>
          {/* ---------------------------------- */}

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="isFlashSale"
              id="flashSaleSwitch"
              checked={stateProduct.isFlashSale}
              onChange={handleOnchange}
            />
            <label className="form-check-label fw-bold text-danger" htmlFor="flashSaleSwitch">
              🔥 Bật chế độ Flash Sale
            </label>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label>Danh mục</label>
              <select className="form-select" name="category" value={stateProduct.category} onChange={handleOnchange}>
                <option value="">Chọn danh mục</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-6 mb-3">
              <label>Thương hiệu</label>
              <select className="form-select" name="brand" value={stateProduct.brand} onChange={handleOnchange}>
                <option value="">Chọn thương hiệu</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group mb-3">
            <label>Mô tả chi tiết</label>
            <textarea className="form-control" rows="4" name="description" value={stateProduct.description} onChange={handleOnchange}></textarea>
          </div>

          <div className="form-group mb-3">
            <label>Album ảnh</label>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              multiple
              maxCount={10}
            >
              {fileList.length >= 10 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
            </Upload>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Biến thể (Màu sắc / Dung tích)</h4>
          </div>
          <p className="text-muted small">Nhập giá tiền cho từng loại tại đây. Giá thấp nhất sẽ được dùng làm giá hiển thị.</p>

          {variants.length === 0 && (
            <div className="alert alert-secondary text-center small">Chưa có biến thể nào.</div>
          )}

          {variants.map((variant, index) => (
            <div key={index} className="card mb-3 p-3 bg-light border-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Biến thể #{index + 1}</strong>
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeVariant(index)} />
              </div>

              {/* Grid nhập liệu */}
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted">Tên biến thể</label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="VD: Đỏ"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted">Kho</label>
                  <input
                    type="number" className="form-control form-control-sm"
                    placeholder="Kho"
                    value={variant.countInStock}
                    onChange={(e) => handleVariantChange(index, 'countInStock', e.target.value)}
                  />
                </div>

                <div className="col-6">
                  <label className="small fw-bold">Giá gốc</label>
                  <input
                    type="number" className="form-control form-control-sm"
                    placeholder="Giá riêng"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="small fw-bold text-danger">Giá Flash Sale</label>
                  <input
                    type="number"
                    className="form-control form-control-sm border-danger"
                    placeholder={stateProduct.isFlashSale ? "Giá sau giảm" : "Tắt sale"}
                    value={variant.flashSalePrice}
                    onChange={(e) => handleVariantChange(index, 'flashSalePrice', e.target.value)}
                    disabled={!stateProduct.isFlashSale} // Khóa nếu không bật sale chung
                  />
                </div>
              </div>

              <div className="mt-2 d-flex align-items-center gap-3">
                <div style={{ flex: 1 }}>
                  <label className="small text-muted d-block">Ảnh biến thể:</label>
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => handleVariantImageUpload(index, file)}
                  >
                    <Button size="small" icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </div>
                {variant.previewImage && (
                  <img src={variant.previewImage} alt="Var" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />
                )}
              </div>
            </div>
          ))}

          <Button type="dashed" block onClick={addVariant} icon={<PlusOutlined />}>
            Thêm biến thể khác
          </Button>
        </div>
      </div>

      <div className="mt-4 text-center d-flex justify-content-center gap-3">
        <Button size="large" onClick={() => navigate('/admin/products')}>
          Hủy bỏ
        </Button>
        <Button type="primary" size="large" onClick={handleUpdateProduct} style={{ minWidth: 200, background: '#00d165' }}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default ProductEditPage;