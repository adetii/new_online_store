import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';
import { getUniqueCategories, filterProductsByCategory } from '../utils/productUtils';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams(); // Get category from URL params
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from your API
        const response = await fetch('/api/products');
        const data = await response.json();
        
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Get all unique categories from products
  const categories = getUniqueCategories(products);
  
  // Filter products by category if a category is selected
  const filteredProducts = filterProductsByCategory(products, category);
  
  return (
    <Container>
      <Row>
        <Col md={3}>
          <h2>Shop by Category</h2>
          <CategoryFilter categories={categories} />
        </Col>
        <Col md={9}>
          <h1>{category || 'All Products'}</h1>
          {loading ? (
           'Loading...'
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Row>
              {filteredProducts.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;