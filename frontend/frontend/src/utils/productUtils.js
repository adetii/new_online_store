/**
 * Extract all unique categories from products array
 * @param {Array} products - Array of product objects
 * @returns {Array} - Array of unique category names
 */
export const getUniqueCategories = (products) => {
  if (!products || !Array.isArray(products)) return [];
  
  // Extract unique categories
  const categories = [...new Set(products.map(product => product.category))];
  
  // Sort categories alphabetically
  return categories.sort();
};

/**
 * Filter products by category
 * @param {Array} products - Array of product objects
 * @param {String} category - Category to filter by
 * @returns {Array} - Filtered products
 */
export const filterProductsByCategory = (products, category) => {
  if (!products || !Array.isArray(products)) return [];
  if (!category) return products; // Return all products if no category specified
  
  return products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};