const express = require('express');
const router = express.Router();

// Mock database
const products = [
  {
    id: '1',
    name: 'Áo thun nữ cao cấp',
    price: 500000,
    image: 'https://via.placeholder.com/300x300?text=Ao+Thun',
    description: 'Áo thun chất lượng cao, thoáng mát, phù hợp cho mọi mùa',
    category: 'áo',
    stock: 50,
    rating: 4.5,
    reviews: 12,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Quần jean nam',
    price: 800000,
    image: 'https://via.placeholder.com/300x300?text=Quan+Jean',
    description: 'Quần jean bền, đẹp, phong cách hiện đại',
    category: 'quần',
    stock: 30,
    rating: 4.2,
    reviews: 8,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Váy đầm nữ',
    price: 1200000,
    image: 'https://via.placeholder.com/300x300?text=Vay+Dam',
    description: 'Váy đầm sang trọng, phù hợp cho các dịp đặc biệt',
    category: 'váy',
    stock: 20,
    rating: 4.8,
    reviews: 15,
    createdAt: new Date()
  }
];

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let filteredProducts = [...products];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Search by name
    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sort === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', (req, res) => {
  try {
    const { name, price, description, category, stock, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      description,
      category,
      stock: stock || 0,
      image: image || 'https://via.placeholder.com/300x300',
      rating: 0,
      reviews: 0,
      createdAt: new Date()
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, price, description, category, stock, image } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image) product.image = image;

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
