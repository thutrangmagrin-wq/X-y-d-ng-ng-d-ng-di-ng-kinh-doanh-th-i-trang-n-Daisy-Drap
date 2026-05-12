const express = require('express');
const router = express.Router();

// Mock database
const reviews = [];

// Create review
router.post('/', (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const newReview = {
      id: Date.now().toString(),
      productId,
      userId,
      rating,
      comment: comment || '',
      createdAt: new Date()
    };

    reviews.push(newReview);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews by product ID
router.get('/product/:productId', (req, res) => {
  try {
    const productReviews = reviews.filter(r => r.productId === req.params.productId);

    const averageRating = productReviews.length > 0
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      count: productReviews.length,
      averageRating,
      data: productReviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews (admin)
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', (req, res) => {
  try {
    const index = reviews.findIndex(r => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const deletedReview = reviews.splice(index, 1);

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: deletedReview[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
