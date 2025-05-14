import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import { 
  useCreateProductMutation, 
  useUploadProductImageMutation 
} from '../../slices/productsApiSlice';
import Loader from '../../components/layout/Loader';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        name,
        price: Number(price),
        image,
        brand,
        category,
        countInStock: Number(countInStock),
        description,
      };
      
      const newProduct = await createProduct(productData).unwrap();
      
      showSuccessToast('Product created successfully');

      navigate('/admin/products');
    } catch (err) {
      console.error('Error creating product:', err);
      showErrorToast(err?.data?.message || err.error || 'An error occurred');
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      showSuccessToast('Image uploaded successfully');
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Failed to upload image');
    }
  };

  return (
    <div className="admin-product-create">
      <Link
        to="/admin/productlist"
        className="flex items-center text-primary mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-1" /> Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create Product</h1>

        {loadingCreate && <Loader />}

        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="countInStock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="text"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <div className="mt-2">
                  <label
                    htmlFor="imageFile"
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300"
                  >
                    <FaUpload className="mr-2" /> Upload Image
                    <input
                      type="file"
                      id="imageFile"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                  {loadingUpload && <Loader small />}
                </div>
              </div>

              {image && (
                <div className="mt-2">
                  <img
                    src={image}
                    alt={name}
                    className="h-32 w-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center"
              disabled={loadingCreate}
            >
              <FaSave className="mr-2" /> Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductCreatePage;
