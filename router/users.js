const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const User = require('../models/User');
const advansedResults = require('../middleware/advansedResults');

router.use(protect); // Any thing below this, will use protect
router.use(authorize('admin')); // Any thing below this, will use authorize

router
  .route('/')
  .get(advansedResults(User) ,getUsers)
  .post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
