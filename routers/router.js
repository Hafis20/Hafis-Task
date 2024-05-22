const express = require('express');
const router = express.Router();
const addTeamController = require('../controllers/addTeamController');


router.get('/add-team',addTeamController.addTeam);
router.get('/process-result',addTeamController.addTeam);
router.get('/team-result',addTeamController.addTeam);

module.exports = router;