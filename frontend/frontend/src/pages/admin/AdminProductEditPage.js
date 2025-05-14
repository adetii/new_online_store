import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const AdminProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const initialState = useMemo(
    () => ({
      name: '',
      price: 0,
      brand: '',
      category: '',
      countInStock: 0,
      description: '',
      image: '',
      lowStockThreshold: 5,
    }),
    []
  );

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
        image: product.image,
        lowStockThreshold: product.lowStockThreshold ?? 5,
      });
    }
  }, [product]);

  const handleChange = useCallback((e) => {
    const { id, value, files } = e.target;
    if (id === 'imageFile' && files?.length) {
      uploadHandler(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [id]: ['price', 'countInStock', 'lowStockThreshold'].includes(id)
          ? Number(value)
          : value,
      }));
    }
  }, []);

  const uploadHandler = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await uploadImage(formData).unwrap();
        setForm((prev) => ({ ...prev, image: res.image }));
        showSuccessToast('Image uploaded successfully');
      } catch (err) {
        showErrorToast(err?.data?.message || err.error || 'Upload failed');
      }
    },
    [uploadImage]
  );

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await updateProduct({ productId, ...form }).unwrap();
        showSuccessToast('Product updated successfully');
        navigate('/admin/products');
      } catch (err) {
        showErrorToast(err?.data?.message || err.error || 'Update failed');
      }
    },
    [updateProduct, form, navigate, productId]
  );

  if (isLoading || loadingUpdate) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  const textFields = [
    { id: 'name', label: 'Name' },
    { id: 'brand', label: 'Brand' },
    { id: 'category', label: 'Category' },
  ];
  const numberFields = [
    { id: 'price', label: 'Price' },
    { id: 'countInStock', label: 'Count In Stock' },
    { id: 'lowStockThreshold', label: 'Low Stock Threshold' },
  ];

  return (
    <div className="admin-product-edit">
      <Link to="/admin/products" className="flex items-center text-primary mb-4 hover:underline">
        <FaArrowLeft className="mr-1" /> Back to Products
      </Link>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {textFields.map(({ id, label }) => (
            <div key={id} className="form-group">
              <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label}
              </label>
              <input
                id={id}
                value={form[id]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-primary"
              />
            </div>
          ))}

          {numberFields.map(({ id, label }) => (
            <div key={id} className="form-group">
              <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label}
              </label>
              <input
                id={id}
                type="number"
                value={form[id]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-primary"
              />
            </div>
          ))}

          <div className="form-group md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-primary"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Image URL
            </label>
            <input
              id="image"
              value={form.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-primary"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageFile" className="inline-flex items-center px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
              <FaUpload className="mr-2" /> Upload Image
              <input id="imageFile" type="file" onChange={handleChange} className="hidden" />
            </label>
            {loadingUpload && <Loader small />}
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="btn-primary flex items-center justify-center px-6 py-2 rounded-lg"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEditPage;
