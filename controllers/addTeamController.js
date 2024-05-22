const playersList = require('../data/players.json');

const addTeam = async (req, res) => {
    try {
        console.log(playersList);
        res.status(200).json(playersList);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:'Internal Server error'});
    }
}

module.exports = {
    addTeam,
}