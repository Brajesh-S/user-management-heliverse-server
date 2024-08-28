//teamRoutes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Route to create a new team
router.post('/', teamController.createTeam);

// Route to get a team by ID
router.get('/:id', teamController.getTeamById);

router.get('/', teamController.getAllTeams);

module.exports = router;
