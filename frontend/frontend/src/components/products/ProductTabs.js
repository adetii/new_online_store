import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaQuestion, FaInfoCircle } from 'react-icons/fa';
import Rating from './Rating';
import Loader from '../layout/Loader';
import Message from '../layout/Message';

const ProductTabs = ({
  product,
  userInfo,
  rating,
  setRating,
  comment,
  setComment,
  submitReviewHandler,
  loadingReview,
  question,
  setQuestion,
  submitQuestionHandler,
  loadingQuestion,
}) => {
  const [activeTab, setActiveTab] = useState('description');
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap border-b">
        <button
          className={`flex items-center px-4 sm:px-6 py-3 text-sm font-medium ${
            activeTab === 'description'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('description')}
        >
          <FaInfoCircle className="mr-2" />
          <span>Description</span>
        </button>
        
        <button
          className={`flex items-center px-4 sm:px-6 py-3 text-sm font-medium ${
            activeTab === 'reviews'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          <FaStar className="mr-2" />
          <span>Reviews ({product.numReviews})</span>
        </button>
        
        <button
          className={`flex items-center px-4 sm:px-6 py-3 text-sm font-medium ${
            activeTab === 'questions'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          } font-bold`}
          onClick={() => setActiveTab('questions')}
        >
          <FaQuestion className="mr-2" />
          <span>Questions</span>
        </button>
      </div>
      
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <p>{product.description}</p>
            
            {product.features && product.features.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-3">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
            
            {product.specifications && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium w-1/3">{key}:</span>
                      <span className="w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
            
            {userInfo ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <form onSubmit={submitReviewHandler}>
                  <div className="mb-4">
                    <label className="block mb-2">Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={`text-2xl ${
                            value <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block mb-2">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
                    disabled={loadingReview}
                  >
                    {loadingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <Message>
                Please{' '}
                <Link to="/login" className="text-primary hover:underline">
                  sign in
                </Link>{' '}
                to write a review
              </Message>
            )}
            
            {product.reviews.length === 0 ? (
              <Message>No reviews yet</Message>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.name}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={review.rating} />
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'questions' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Questions & Answers</h2>
            
            {userInfo ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Ask a Question</h3>
                <form onSubmit={submitQuestionHandler}>
                  <div className="mb-4">
                    <label htmlFor="question" className="block mb-2">
                      Your Question
                    </label>
                    <textarea
                      id="question"
                      rows="3"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
                    disabled={loadingQuestion}
                  >
                    {loadingQuestion ? <Loader small /> : 'Submit Question'}
                  </button>
                </form>
              </div>
            ) : (
              <Message>
                Please{' '}
                <Link to="/login" className="text-primary hover:underline">
                  sign in
                </Link>{' '}
                to ask a question
              </Message>
            )}
            
            {product.questions && product.questions.length === 0 ? (
              <Message>No questions yet</Message>
            ) : (
              <div className="space-y-6">
                {product.questions &&
                  product.questions.map((q) => (
                    <div key={q._id} className="border-b pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{q.name}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mb-4">{q.question}</p>
                      {q.answer && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="font-medium mb-2">Answer:</p>
                          <p>{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;