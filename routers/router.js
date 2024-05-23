const express = require('express');
const router = express.Router();

// Controllers
const addTeamController = require('../controllers/addTeamController');
const processResultController = require('../controllers/processResultController');
const teamResultController = require('../controllers/teamResultController');


// API Requests
router.get('/get-players',addTeamController.getPlayers);
router.post('/add-team',addTeamController.addTeam);
router.get('/process-result',processResultController.processResult);
router.get('/team-result',teamResultController.teamResult);

module.exports = router;