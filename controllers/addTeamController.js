const playersList = require('../data/players.json');
const Team = require('../model/teamModel');


// For selecting the players
const getPlayers = async (req, res) => {
    try {
        const availablePlayers = playersList;
        res.status(200).json(availablePlayers);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// For adding 11 members team
// Expected Data : {teamName:"string",players:[],captain:"string",viceCaptain:"string"}
const addTeam = async (req, res) => {
    try {
        const { teamName, players, captain, viceCaptain } = req.body;  // Destructing the body

        // Checking required data all found
        if (!teamName || !players || !captain || !viceCaptain) {
            return res.status(400).json({ message: "Required data not found." });
        }

        // Checking the team name is unique
        const isTeamNameUnique = await Team.findOne({ teamName: teamName });
        if (isTeamNameUnique) {
            return res.status(400).json({ message: "Team name already taken." });
        }

        // Checking the members count is 11
        if (players.length <= 10 || players.length >= 12) {
            return res.status(400).json({ message: "Players count mismatch. Please provide 11 players for the team." });
        } else {
            // Checking the 11 players all are from the player list
            const isAllFromPlayersList = players.every((player) => playersList.some(playerObj => playerObj.Player === player));

            if (!isAllFromPlayersList) {
                return res.status(400).json({ message: "Please select players from players list" });
            }

            // Checking if players are 11 and no duplicates
            if (players.length !== new Set(players).size) {
                return res.status(400).json({ message: "Duplicates are not allowed" });
            }
        }

        // Checking all the players from one team
        let noOfChennaiPlayers = 0;
        let noOfRajastanPlayers = 0;
        let noOfWicketKeeper = 0;
        let noOfBatter = 0;
        let noOfAllRounder = 0;
        let noOfBowler = 0;

        await players.forEach((player) => playersList.forEach(playerObj => {
            if (player === playerObj.Player) {

                // Checking how many players per team
                if (playerObj.Team === 'Chennai Super Kings') {
                    noOfChennaiPlayers++;
                } else {
                    noOfRajastanPlayers++;
                }

                // Checking how many players per role
                switch (playerObj.Role) {
                    case 'WICKETKEEPER':
                        noOfWicketKeeper++;
                        break;
                    case 'ALL-ROUNDER':
                        noOfAllRounder++;
                        break;
                    case 'BATTER':
                        noOfBatter++;
                        break;
                    case 'BOWLER':
                        noOfBowler++;
                        break;
                    default:
                        break;
                }
            }
        }));

        // Checking All the players from chennai or rajastan?
        if (noOfChennaiPlayers === 11 || noOfRajastanPlayers === 11) {
            return res.status(400).json({ message: 'Maximum of 10 players can be selected from any one of the teams' })
        }

        // Checking the no of player count is correct
        if ((noOfBowler < 1 || noOfBowler > 8) || (noOfAllRounder < 1 || noOfAllRounder > 8) || (noOfBatter < 1 || noOfBatter > 8) || (noOfWicketKeeper < 1 || noOfWicketKeeper > 8)) {
            return res.status(400).json(
                {
                    message: 'Limit of players Invalid',
                    ALL_ROUNDER: noOfAllRounder,
                    BATTER: noOfBatter,
                    BOWLER: noOfBowler,
                    WICKETKEEPER: noOfWicketKeeper
                }
            );
        }

        // Checking the captain and vice captain is exists in team
        if (!players.includes(captain)) {
            return res.status(400).json({ message: 'Captain not exists in team' })
        }

        if (!players.includes(viceCaptain)) {
            return res.status(400).json({ message: 'Vice Captain not exists in team' })
        }

        // If every validation is correct Save into db
        const createTeam = await Team.create({
            teamName: teamName,
            players: players,
            captain: captain,
            viceCaptain: viceCaptain
        });
        res.status(200).json({ message: 'Team Added' });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    addTeam,
    getPlayers
}