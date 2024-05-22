

const processResult = async (req, res) => {
    try {
        res.status(200).json('Result Processed');
    } catch (error) {
        res.status(500).json({message:'Internal Server error'});
    }
}

module.exports = {
    processResult,
}