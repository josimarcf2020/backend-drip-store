const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const User = require('../api/models/users.js'); // Corrected: Import the Sequelize model, not the controller

require('dotenv').config(); 
const generateToken = (user) => { 
    return jwt.sign(
        { id: user.id, email: user.email }, // Use a unique identifier from your model, like email
        process.env.APP_KEY, 
        { expiresIn: '1h' }
    ); 
}; 

exports.register = async (req, res) => { 
    const { firstName, surName, email, password } = req.body; // Match the User model fields
    const hashedPassword = await bcrypt.hash(password, 10); 
    try { 
        const user = await User.create(
            { firstName, surName, email, password: hashedPassword }
        ); 
        
        res.json(
            { user, token: generateToken(user) }
        ); 
    } catch (error) { 
        res.status(400).json(
            { error: error.message }
        ); 
    } 

}; 

exports.login = async (req, res) => { 
    // Your User model uses 'email', not 'username'.
    const { email, password } = req.body; 
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json(
                { error: 'Invalid credentials' }
            ); 
        } 
        
        res.json({ token: generateToken(user) }); 
    
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 

}; 

exports.verifyToken = (req, res, next) => { 
    const token = req.headers['authorization']; 
    if (!token) { 
        return res.status(403).json({ error: 'No token provided' }); 
    } 
    
    jwt.verify(token, process.env.APP_KEY, (err, decoded) => { 
        if (err) { 
            return res.status(401).json({ error: 'Failed to authenticate token' }); 
        } 
        req.userId = decoded.id; next(); 
    }); 
};