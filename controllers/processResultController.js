const Team = require('../model/teamModel');
const playersList = require('../data/players.json');
const matchData = require('../data/match.json');

const processResult = async (req, res) => {
    try {
        const playerResults = {};
        const allTeams = await Team.find({})
        console.log(allTeams);

        for (let player of playersList) {
            playerResults[player.Player] = {
                points: 0,
                runs: 0,
                fours: 0,
                sixes: 0,
                wickets: 0,
                lbwOrBowled: 0,
                catches: 0,
                stumpings: 0,
                runOuts: 0,
                balls: 0,
                maidenOvers: 0,
                isDuck: false,
                name: player.Player,
                role: player.Role
            };
        }

        let currentOver = 0;
        let eachOverRuns = 0;
        let ballsInOver = 0;

        matchData.forEach(ballData => {
            const bowlerName = ballData.bowler;
            const batterName = ballData.batter;

            // Update runs and points for the batter
            playerResults[batterName].runs += ballData.batsman_run;
            playerResults[batterName].points += ballData.batsman_run;

            // Boundary and Six Bonus
            if (ballData.batsman_run === 4) {
                playerResults[batterName].fours += 1;
                playerResults[batterName].points += 1;
            }
            if (ballData.batsman_run === 6) {
                playerResults[batterName].sixes += 1;
                playerResults[batterName].points += 2;
            }

            // Track total runs in the current over
            eachOverRuns += ballData.total_run;
            ballsInOver += 1;

            // Check for end of over
            if (ballsInOver === 6) {
                if (eachOverRuns === 0) {
                    playerResults[bowlerName].maidenOvers += 1;
                    playerResults[bowlerName].points += 12; // Maiden over bonus
                }
                eachOverRuns = 0;
                ballsInOver = 0;
                currentOver++;
            }

            // Check for wickets
            if (ballData.isWicketDelivery) {
                playerResults[bowlerName].wickets += 1;
                playerResults[bowlerName].points += 25; // Wicket points
                if (ballData.kind === 'lbw' || ballData.kind === 'bowled') {
                    playerResults[bowlerName].lbwOrBowled += 1;
                    playerResults[bowlerName].points += 8; // LBW/Bowled bonus
                }

                // Fielding points
                if (ballData.kind === 'caught') {
                    const fielder = ballData.fielders_involved;
                    playerResults[fielder].catches += 1;
                    playerResults[fielder].points += 8; // Catch points
                    if (playerResults[fielder].catches % 3 === 0) {
                        playerResults[fielder].points += 4; // 3 Catch bonus
                    }
                } else if (ballData.kind === 'stumped') {
                    const fielder = ballData.fielders_involved;
                    playerResults[fielder].stumpings += 1;
                    playerResults[fielder].points += 12; // Stumping points
                } else if (ballData.kind === 'run out') {
                    const fielder = ballData.fielders_involved;
                    playerResults[fielder].runOuts += 1;
                    playerResults[fielder].points += 6; // Run out points
                }
                // console.log(playerResults[batterName].role,'kbdfewdewdd');
                // Duck check
                if (ballData.batsman_run === 0 && playerResults[batterName].runs === 0 && ballsInOver === 1
                    && playerResults[batterName].role !== 'BOWLER') {
                    playerResults[batterName].isDuck = true;
                    playerResults[batterName].points -= 2; // Duck penalty
                }

            }
        });

        // console.log(playerResults);

        for (const team of allTeams) {
            let totalPoints = 0;
            for (const playerName of team.players) {
                let playerPoints = playerResults[playerName] ? playerResults[playerName].points : 0;
                if (playerResults[playerName].runs > 30) playerPoints += 4 // bonus 30 runs
                if (playerResults[playerName].runs >= 50) playerPoints += 8 // Half-century Bonus
                if (playerResults[playerName].runs >= 100) playerPoints += 16 // Century Bonus
                if (playerResults[playerName].wickets===3)  playerPoints += 4 // 3 Wicket Bonus	
                if (playerResults[playerName].wickets===4)  playerPoints += 8 // 4 Wicket Bonus	
                if (playerResults[playerName].wickets===5)  playerPoints += 16 // 5 Wicket Bonus	
                if (playerName === team.captain) playerPoints *= 2;
                if (playerName === team.viceCaptain) playerPoints *= 1.5;
                totalPoints += playerPoints;
            }
            team.points = totalPoints;
            console.log(team);
            await team.save();
        }
        res.send('Match results processed.');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Internal Server error'});
    }
}

module.exports = {
    processResult,
}