import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';
import { 
  CategoryWrapper,
  PageHeader,
  SearchSection,
  TableCard,
  TableResponsive,
  LoadingWrapper,
  NoDataMessage,
  ModalContent
} from './style';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchCategories = useCallback(async (page, search = '') => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        search: search,
      };
      const response = await apiService.get('/categories', { params });
      setCategories(response.data.categories || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Không thể tải danh mục.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCategories(currentPage, searchTerm);
  }, [fetchCategories, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setCategoryName('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.error('Tên danh mục không được để trống.');
      return;
    }

    setFormLoading(true);
    const payload = { name: categoryName };

    try {
      if (isEditMode && currentCategory) {
        await apiService.put(`/categories/${currentCategory._id}`, payload);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await apiService.post('/categories', payload);
        toast.success('Thêm danh mục thành công!');
      }
      
      closeModal();
      fetchCategories(currentPage, searchTerm);
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (category) => {
    toast((t) => (
      <span>
        Bạn có chắc muốn xóa <b>{category.name}</b>?
        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => {
            confirmDelete(category._id);
            toast.dismiss(t.id);
          }}
        >
          Xóa
        </button>
        <button
          className="btn btn-secondary btn-sm ms-1"
          onClick={() => toast.dismiss(t.id)}
        >
          Hủy
        </button>
      </span>
    ), { duration: 6000 });
  };

  const confirmDelete = async (id) => {
    const toastId = toast.loading('Đang xóa...');
    try {
      await apiService.delete(`/categories/${id}`);
      toast.success('Xóa danh mục thành công!', { id: toastId });
      fetchCategories(currentPage, searchTerm);
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Xóa thất bại.', { id: toastId });
    }
  };

  return (
    <CategoryWrapper>
      <PageHeader>
        <div className="header-row">
          <h1 className="page-title">Categories</h1>
          <button className="btn-primary" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Category
          </button>
        </div>
      </PageHeader>

      <SearchSection>
        <input 
          type="text"
          className="search-input"
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchSection>

      <TableCard>
        <TableResponsive>
          <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                {/* Đã xóa cột Status */}
                <th className="text-end">Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3">
                    <LoadingWrapper>
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </LoadingWrapper>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id}>
                    <td className="category-id" style={{fontSize: '100%'}}>{category._id}</td>
                    <td className="category-name">{category.name}</td>
                    {/* Đã xóa dòng Switch status */}
                    <td className="actions-cell">
                      <button
                        className="btn btn-warning"
                        onClick={() => openEditModal(category)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(category)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    <NoDataMessage>No categories found</NoDataMessage>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableResponsive>
      </TableCard>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal
        id="categoryModal"
        title={isEditMode ? 'Edit Category' : 'Add New Category'}
        show={showModal}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={formLoading}>
              {formLoading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              ) : 'Save'}
            </button>
          </>
        }
      >
        <ModalContent>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
        </ModalContent>
      </Modal>
    </CategoryWrapper>
  );
};

export default CategoryPage;