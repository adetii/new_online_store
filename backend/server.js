import express from 'express'; 
import morgan from 'morgan'; 
import chalk from 'chalk'; 
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; 
import connectDB from './config/db.js'; 
import cors from 'cors'; 

// Import routes 
import productRoutes from './routes/productRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js'; 
import paymentRoutes from './routes/paymentRoutes.js'; 
import contactRoutes from './routes/contactRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js'; 
import uploadRoutes from './routes/uploadRoutes.js'; 

// Load environment variables 
dotenv.config(); 

// __dirname for ES modules 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// Connect to MongoDB 
connectDB(); 

const app = express(); 

// Helper to pick a color per method 
function colorMethod(method) { 
  switch (method) { 
    case 'GET':    return chalk.green(method); 
    case 'POST':   return chalk.blue(method); 
    case 'PUT':    return chalk.yellow(method); 
    case 'DELETE': return chalk.red(method); 
    case 'PATCH':  return chalk.magenta(method); 
    default:       return chalk.white(method); 
  } 
} 

// Morgan format function with colored method 
app.use(morgan((tokens, req, res) => { 
  const meth   = tokens.method(req, res); 
  const url    = tokens.url(req, res); 
  const status = tokens.status(req, res); 
  const time   = tokens['response-time'](req, res) + ' ms'; 
  const coloredMethod = colorMethod(meth); 

  return `${coloredMethod} ${url} ${status} ${time}`; 
})); 

// Middlewares 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Production CORS configuration
const allowedOrigins = [
  'https://shopname.onrender.com' // Your frontend URL
]; 

app.use(cors({ 
  origin: function(origin, callback) { 
    // Allow requests with no origin (like mobile apps, curl, etc) 
    if (!origin) return callback(null, true); 
    
    if (allowedOrigins.indexOf(origin) === -1) { 
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'; 
      return callback(new Error(msg), false); 
    }
    return callback(null, true); 
  }, 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Static files 
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

// API routes 
app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/payments', paymentRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/upload', uploadRoutes); 
app.use('/api/contact', contactRoutes); 

// Serve static files from the React build folder 
app.use(express.static(path.join(__dirname, '../frontend/build'))); 

// Catch-all route to serve React's index.html for any route not handled by the API 
app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html')); 
}); 

// Error handlers 
app.use(notFound); 
app.use(errorHandler); 

// Start server 
const port = process.env.PORT || 5000; 
app.listen(port, () => { 
  console.log(`Server running on port ${port}`); 
});
