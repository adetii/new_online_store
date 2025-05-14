// import React from 'react';

// const Sidebar = ({ onSelectCategory, selectedCategory }) => {
//   // Categories from your products.js file
//   const categories = [
//     'Electronics', 
//     'Clothing', 
//     'Home & Kitchen', 
//     'Sports & Outdoors', 
//     'Beauty & Personal Care'
//   ];
  
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-3">Categories</h2>
//       <div className="flex flex-col space-y-2">
//         <button 
//           type="button"
//           onClick={() => onSelectCategory('')}
//           className={`w-full py-2 px-4 rounded text-left ${
//             selectedCategory === '' 
//               ? 'bg-primary text-white' 
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           } transition-colors duration-200`}
//         >
//           All Products
//         </button>
        
//         {/* Static categories from products.js */}
//         {categories.map((category) => (
//           <button
//             type="button"
//             key={category}
//             onClick={() => onSelectCategory(category)}
//             className={`w-full py-2 px-4 rounded text-left ${
//               selectedCategory === category 
//                 ? 'bg-primary text-white' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             } transition-colors duration-200`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;