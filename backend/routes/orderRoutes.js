const express = require('express');
const router = express.Router();

// Mock database
const orders = [];

// Create order
router.post('/', (req, res) => {
  try {
    const { userId, items, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!userId || !items || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = {
      id: Date.now().toString(),
      userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin)
router.get('/', (req, res) => {
  try {
    const { status, userId } = req.query;

    let filteredOrders = [...orders];

    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }

    if (userId) {
      filteredOrders = filteredOrders.filter(o => o.userId === userId);
    }

    res.json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
router.put('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { status } = req.body;

    if (status) {
      order.status = status;
      order.updatedAt = new Date();
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order statistics (admin)
router.get('/stats/summary', (req, res) => {
  try {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
