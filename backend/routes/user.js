const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username : username,
        email : email,
        password: hashedPassword
    });
    try {
        await newUser.save();
        res.status(200).send("User registered successfully");
    } catch (error) {
        res.status(400).json({error});
    }
}
);

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const currentUser = await User.findOne({email});
    if (!currentUser) {
        return res.status(400).send("Email not found");
    }
    const passwordMatch = await bcrypt.compare(password, currentUser.password);
    if (!passwordMatch) {
        return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({id: currentUser._id, username: currentUser.username, email: currentUser.email, role: currentUser.role}, process.env.SECRET);
    res.json({token});
}
);

module.exports = router;

