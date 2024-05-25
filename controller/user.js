const User = require("../models/user")

exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        req.profile = user;
        next();
    } catch (error) {
        console.error('Error in userById:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};