const Team = require('../model/teamModel');

const teamResult = async (req, res) => {
    try {
        const allTeams = await Team.find({})
        const maxPoints = Math.max(...allTeams.map(team => team.points));
        const winners = allTeams.filter(team => team.points === maxPoints);
        console.log(winners);
        res.json({
            allTeams: allTeams.map(team => ({
                name: team.teamName,
                totalPoints: team.points
            })),
            winners: winners.map(team => ({
                name: team.teamName,
                totalPoints: team.points
            }))
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports = {
    teamResult,
}