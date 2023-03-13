const UserController = require('@controllers/userController');
const { Router } = require('express');
const router = Router();
router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
module.exports = router;
