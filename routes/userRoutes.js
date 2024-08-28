// //userRoutes.js
// const express = require("express");
// const {
//   createUser,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
// } = require("../controllers/userController");

// const router = express.Router();

// router.route("/")
//   .get(getUsers)
//   .post(createUser);

// router.route("/:id")
//   .get(getUserById)
//   .put(updateUser)
//   .delete(deleteUser);

// module.exports = router;
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);  // GET all users with optional filtering
router.get('/:id', userController.getUserById);  // GET a user by ID
router.post('/', userController.createUser);  // POST to create a new user
router.put('/:id', userController.updateUser);  // PUT to update a user by ID
router.delete('/:id', userController.deleteUser);  // DELETE a user by ID

module.exports = router;

