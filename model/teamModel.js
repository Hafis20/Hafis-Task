const mongoose = require('mongoose');

const teamModel = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    players: {
        type: Array,
        required: true
    },
    captain: {
        type: String,
        required: true
    },
    viceCaptain: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('AddedTeam', teamModel);