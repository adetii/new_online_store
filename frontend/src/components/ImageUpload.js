import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const ImageUpload = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.image);
      onImageUploaded(data.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Image
      </label>
      <div className="flex items-center space-x-2">
        <label className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors">
          <span className="flex items-center">
            <FaUpload className="mr-2" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </span>
          <input
            type="file"
            onChange={uploadFileHandler}
            className="hidden"
            accept="image/*"
          />
        </label>
        {uploading && <FaSpinner className="animate-spin text-primary" />}
      </div>
      {image && (
        <div className="mt-2">
          <img
            src={image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;