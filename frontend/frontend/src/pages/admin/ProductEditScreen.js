import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation
} from '../../slices/productsApiSlice';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import Loader from '../../components/layout/Loader';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();
      toast.success('Product updated');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <button
          onClick={() => navigate('/admin/productlist')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>

      {isLoading ? <Loader /> : error ? (
        <div className="alert alert-error">{error.data.message}</div>
      ) : (
        <form onSubmit={submitHandler} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-3 border rounded-md mr-2"
                />
                <label className="cursor-pointer bg-gray-200 p-3 rounded-md hover:bg-gray-300">
                  <input
                    type="file"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                  <FaUpload />
                </label>
              </div>
              {loadingUpload && <Loader small />}
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="form-group">
              <label>Count In Stock</label>
              <input
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
            </div>
          </div>

          <div className="form-group mt-6">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-md h-32"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark"
            disabled={loadingUpdate}
          >
            {loadingUpdate ? <Loader small /> : 'Update Product'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEditScreen;