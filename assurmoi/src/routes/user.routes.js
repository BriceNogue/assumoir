const express = require('express');
const router = express.Router();
const userService = require('../services/user.service'); // Votre service CRUD User
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.use(protect, restrictTo('ADMIN'));

router.get('/', userService.getAllUsers);
router.get('/:id', userService.getUser);
router.post('/', userService.createUser);
router.put('/:id', userService.updateUser);
router.delete('/:id', userService.deleteUser);

module.exports = router;