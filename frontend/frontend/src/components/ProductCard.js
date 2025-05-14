import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  // Add a more robust safety check
  if (!product) {
    return null;
  }

  return (
    <Card className="my-3 p-3 rounded" style={{ minHeight: '400px', width: '100%' }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.image} 
          variant="top" 
          style={{ height: '220px', objectFit: 'cover' }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="mb-2">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div" className="mb-2">
          <Rating
            value={product.rating || 0}
            text={`${product.numReviews || 0} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">₵{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;