const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// Custom CORS Middleware to avoid extra dependencies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Database setup
const FALLBACK_DB_PATH = path.join(__dirname, 'db_fallback.json');
let useMongo = false;
let dbFallbackData = { products: [] };

// Default products to seed if offline or API fails
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 299.99,
    description: 'High-quality sound with active noise cancellation and 30-hour battery life.',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    category: 'Electronics',
    stock: 45,
    status: 'Active'
  },
  {
    id: 2,
    title: 'Minimalist Desk Lamp',
    price: 89.50,
    description: 'Adjustable brightness and sleek design perfect for any modern workspace.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
    category: 'Home & Office',
    stock: 120,
    status: 'Active'
  },
  {
    id: 3,
    title: 'Mechanical Keyboard v2',
    price: 159.00,
    description: 'Tactile mechanical switches, RGB backlighting, and premium aluminum frame.',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'],
    category: 'Electronics',
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: 4,
    title: 'Ergonomic Office Chair',
    price: 450.00,
    description: 'High-back mesh chair with adjustable lumbar support and 3D armrests.',
    images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800'],
    category: 'Furniture',
    stock: 12,
    status: 'Active'
  },
  {
    id: 5,
    title: 'Ceramic Coffee Mug',
    price: 24.00,
    description: 'Handcrafted ceramic mug, dishwasher and microwave safe.',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'],
    category: 'Home & Office',
    stock: 200,
    status: 'Active'
  }
];

// Product Schema (for MongoDB)
const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: String, default: 'General' },
  stock: { type: Number, default: 10 },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// Load or initialize local fallback file database
function loadFallbackDb() {
  try {
    if (fs.existsSync(FALLBACK_DB_PATH)) {
      const raw = fs.readFileSync(FALLBACK_DB_PATH, 'utf8');
      dbFallbackData = JSON.parse(raw);
    } else {
      dbFallbackData = { products: [...DEFAULT_PRODUCTS] };
      saveFallbackDb();
    }
  } catch (err) {
    console.error("Error loading fallback database, using in-memory:", err);
    dbFallbackData = { products: [...DEFAULT_PRODUCTS] };
  }
}

function saveFallbackDb() {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(dbFallbackData, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to write to fallback DB file:", err);
  }
}

// Seed function
async function seedDatabase() {
  // If MongoDB is active
  if (useMongo) {
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log("Seeding MongoDB with default products...");
        await Product.insertMany(DEFAULT_PRODUCTS);
        console.log("Seeding finished successfully.");
      }
    } catch (err) {
      console.error("Failed to seed MongoDB:", err);
    }
  } else {
    // If using fallback DB and it is empty
    if (!dbFallbackData.products || dbFallbackData.products.length === 0) {
      dbFallbackData.products = [...DEFAULT_PRODUCTS];
      saveFallbackDb();
      console.log("Seeding fallback DB with default products...");
    }
  }
}

// Attempt MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/merkato_store';
console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    useMongo = true;
    seedDatabase();
  })
  .catch(err => {
    console.warn("MongoDB connection failed! Operating system fallback to JSON file database mode.");
    console.warn(`Reason: ${err.message}`);
    useMongo = false;
    loadFallbackDb();
    seedDatabase();
  });

// API Routes

// GET /api/products - Get all products with optional search query
app.get('/api/products', async (req, res) => {
  const searchQuery = req.query.search || '';
  console.log(`GET /api/products - Search query: "${searchQuery}"`);

  try {
    if (useMongo) {
      let query = {};
      if (searchQuery) {
        query = {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } }
          ]
        };
      }
      const products = await Product.find(query).sort({ createdAt: -1 });
      return res.json(products);
    } else {
      let filtered = dbFallbackData.products;
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          (p.title && p.title.toLowerCase().includes(queryLower)) ||
          (p.category && p.category.toLowerCase().includes(queryLower)) ||
          (p.description && p.description.toLowerCase().includes(queryLower))
        );
      }
      // Sort newest first (reverse order)
      const sorted = [...filtered].reverse();
      return res.json(sorted);
    }
  } catch (err) {
    console.error("Error retrieving products:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/products/:id - Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  console.log(`GET /api/products/${req.params.id}`);

  try {
    if (useMongo) {
      // Check if MongoDB ID is a number or standard string
      const product = await Product.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json(product);
    } else {
      const product = dbFallbackData.products.find(p => p.id === productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json(product);
    }
  } catch (err) {
    console.error("Error retrieving product:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/products - Add a new product
app.post('/api/products', async (req, res) => {
  const { title, price, description, images, category, stock, status } = req.body;
  console.log("POST /api/products - Received:", req.body);

  if (!title || price === undefined) {
    return res.status(400).json({ error: "Title and price are required." });
  }

  try {
    let newId = Date.now(); // Unique numeric ID

    const productData = {
      id: newId,
      title,
      price: parseFloat(price),
      description: description || '',
      images: Array.isArray(images) ? images : (images ? [images] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']),
      category: category || 'General',
      stock: stock !== undefined ? parseInt(stock, 10) : 10,
      status: status || 'Active'
    };

    if (useMongo) {
      const newProduct = new Product(productData);
      await newProduct.save();
      console.log(`Saved product to MongoDB: ${newProduct.title}`);
      return res.status(201).json(newProduct);
    } else {
      dbFallbackData.products.push(productData);
      saveFallbackDb();
      console.log(`Saved product to fallback JSON: ${productData.title}`);
      return res.status(201).json(productData);
    }
  } catch (err) {
    console.error("Error saving product:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
