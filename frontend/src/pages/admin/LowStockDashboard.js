import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useGetLowStockProductsQuery } from '../../slices/productsApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';

const LowStockDashboard = () => {
  const { data: products, isLoading, error } = useGetLowStockProductsQuery();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Low Stock Products</h1>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>STOCK</th>
                <th>THRESHOLD</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {product.countInStock}
                    </span>
                  </td>
                  <td>{product.lowStockThreshold}</td>
                  <td>
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className='btn btn-sm btn-light mx-2'
                    >
                      <FaEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default LowStockDashboard;