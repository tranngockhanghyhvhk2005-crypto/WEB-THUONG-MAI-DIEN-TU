const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/create', protect, adminOnly, brandController.createBrand);
router.put('/update/:id', protect, adminOnly, brandController.updateBrand);
router.delete('/delete/:id', protect, adminOnly, brandController.deleteBrand);

router.get('/get-all', brandController.getAllBrand);
router.get('/get-details/:id', brandController.getDetailsBrand);

module.exports = router;