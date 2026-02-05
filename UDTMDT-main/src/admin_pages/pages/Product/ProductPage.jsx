import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import { ProductWrapper, ProductHeader, ProductFilters, ProductTable, NoDataMessage, LoadingWrapper } from './style';
// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

// --- HÀM HELPER QUAN TRỌNG: Lấy thông tin hiển thị chuẩn ---
const getProductDisplayInfo = (product) => {
  // 1. Lấy Ảnh
  let image = '/assets/img/product-placeholder.jpg'; // Ảnh mặc định

  // Check ảnh ở root (Schema mới)
  if (product.images && product.images.length > 0) {
    const firstImg = product.images[0];
    // Xử lý cả 2 trường hợp: chuỗi url hoặc object {url: ...}
    image = typeof firstImg === 'object' ? firstImg.url : firstImg;
  }
  // Fallback: Check ảnh trong variations (Data cũ)
  else if (product.variations && product.variations.length > 0) {
    // Data cũ có thể để ảnh trong variation đầu tiên
    image = product.variations[0].image || image;
  }

  // 2. Lấy Giá
  let price = product.price;
  // Fallback: Nếu giá gốc = 0, lấy giá của biến thể đầu tiên
  if ((!price || price === 0) && product.variations && product.variations.length > 0) {
    price = product.variations[0].price;
  }

  // 3. Lấy Tồn kho
  let stock = product.countInStock;
  // Fallback: Nếu kho gốc = 0, cộng dồn kho của các biến thể
  if ((!stock || stock === 0) && product.variations && product.variations.length > 0) {
    stock = product.variations.reduce((acc, curr) => acc + (curr.stock || curr.quantity || 0), 0);
  }

  return { image, price, stock };
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brands, setBrands] = useState([]);
  const [brandFilter, setBrandFilter] = useState('');

  // Tải danh mục
  useEffect(() => {
      const fetchFiltersData = async () => {
          try {
              const [resCat, resBrand] = await Promise.all([
                  apiService.get('/categories/get-all'),
                  apiService.get('/brand/get-all')
              ]);
              if (resCat.data.status === 'OK') {
                  setCategories(resCat.data.data || resCat.data.categories || []);
              }
              
              if (resBrand.data.status === 'OK') {
                  setBrands(resBrand.data.data || []);
              }
          } catch (error) {
              console.error("Lỗi tải bộ lọc:", error);
          }
      };
      fetchFiltersData();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async (page, search, catId, brandId) => {
    try {
      setLoading(true);
      const params = { 
          page: page, 
          limit: limit, 
          search: search,
          // Gửi thêm param nếu có chọn
          category: catId || undefined,
          brand: brandId || undefined
      };
      
      const response = await apiService.get('/products/get-all', { params });
      
      setProducts(response.data.data || []);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / limit));
      setCurrentPage(response.data.currentPage || page);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Không thể tải sản phẩm.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // Debounce nhẹ cho search text nếu cần, ở đây gọi thẳng để đơn giản
    fetchProducts(currentPage, searchTerm, categoryFilter, brandFilter);
  }, [fetchProducts, currentPage, searchTerm, categoryFilter, brandFilter]);

  // Handlers
  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (e) => {
      setBrandFilter(e.target.value);
      setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'in_stock' ? 'out_of_stock' : 'in_stock';
    const toastId = toast.loading('Đang cập nhật...');
    try {
      await apiService.put(`/products/${product._id}`, { status: newStatus });
      toast.success('Cập nhật thành công!', { id: toastId });

      setProducts(products.map(p =>
        p._id === product._id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      toast.error('Cập nhật thất bại.', { id: toastId });
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <span>
        Bạn có chắc muốn xóa sản phẩm này?
        <button className="btn btn-danger btn-sm ms-2" onClick={() => { confirmDelete(id); toast.dismiss(t.id); }}>Xóa</button>
        <button className="btn btn-secondary btn-sm ms-1" onClick={() => toast.dismiss(t.id)}>Hủy</button>
      </span>
    ));
  };

  const confirmDelete = async (id) => {
    try {
      await apiService.delete(`/products/delete/${id}`);
      toast.success('Xóa sản phẩm thành công!');
      // Load lại dữ liệu hiện tại
      fetchProducts(currentPage, searchTerm, categoryFilter, brandFilter);
    } catch (error) {
      toast.error('Xóa thất bại.');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8080${path}`;
  };


  return (
    <ProductWrapper>
      <ProductHeader>
        <div><h2>Products</h2></div>
        <div>
          <Link to="/admin/product/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Product
          </Link>
        </div>
      </ProductHeader>

      <ProductFilters>
        {/* 1. Tìm kiếm */}
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* 2. Lọc theo Danh mục */}
        <div className="filter-select">
            <select className="form-select" value={categoryFilter} onChange={handleCategoryChange}>
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
        </div>

        {/* 3. Lọc theo Thương hiệu */}
        <div className="filter-select">
            <select className="form-select" value={brandFilter} onChange={handleBrandChange}>
                <option value="">Tất cả thương hiệu</option>
                {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
            </select>
        </div>
      </ProductFilters>

      <ProductTable>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8"><LoadingWrapper><div className="spinner-border"></div></LoadingWrapper></td></tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td><small style={{fontFamily: 'monospace', color: '#666', fontSize: '120%'}}>#{product._id.slice(-6)}</small></td>
                  <td>
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"}}
                      />
                  </td>
                  <td>
                      <div style={{fontWeight: '500'}}>{product.name}</div>
                  </td>
                  {/* Hiển thị tên Category */}
                  <td>{product.category?.name || product.type?.name || '---'}</td>
                  
                  {/* Hiển thị tên Brand */}
                  <td>{product.brand?.name || '---'}</td>
                  
                  <td style={{color: '#d63031', fontWeight: 'bold'}}>{formatCurrency(product.price)}</td>
                  <td>
                      <span className={`badge ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.countInStock}
                      </span>
                  </td>
                  
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                        <Link to={`/admin/product/edit/${product._id}`} className="btn btn-sm btn-warning">
                            <i className="fas fa-edit"></i>
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8"><NoDataMessage>No products found.</NoDataMessage></td></tr>
            )}
          </tbody>
        </table>
      </ProductTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </ProductWrapper>
  );
};

export default ProductPage;