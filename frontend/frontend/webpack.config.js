// ... existing code ...

module.exports = {
  // ... other webpack configuration ...
  
  devServer: {
    // ... other devServer options ...
    
    // Replace these deprecated options:
    // onBeforeSetupMiddleware: function (devServer) {
    //   // Your before middleware setup
    // },
    // onAfterSetupMiddleware: function (devServer) {
    //   // Your after middleware setup
    // },
    
    // With this new option:
    setupMiddlewares: (middlewares, devServer) => {
      // Your before middleware setup (if any)
      
      // Don't remove the default middlewares
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      
      // Your after middleware setup (if any)
      
      return middlewares;
    },
  },
  
  // ... rest of your webpack configuration ...
};