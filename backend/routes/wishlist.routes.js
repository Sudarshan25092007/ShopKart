const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
} = require('../controllers/wishlist.controller');

router.post('/:productId', protect, addToWishlist);
router.get('/', protect, getWishlist);
router.delete('/:productId', protect, removeFromWishlist);
router.patch('/:productId/toggle', protect, toggleWishlist);

module.exports = router;
