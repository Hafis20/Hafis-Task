

const teamResult = async (req, res) => {
    try {
        res.status(200).json('Team result');
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

module.exports = {
    teamResult,
}