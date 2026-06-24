const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"});
};

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
            verified: false
        });

        const message = `
Welcome to ShopNest!

Hello ${name},

Thank you for registering.

Your OTP is: ${otp}

This OTP will expire in 10 minutes.
`;

        await sendEmail(
            email,
            "ShopNest - Email Verification OTP",
            message
        );

        res.status(201).json({
            success: true,
            message: "OTP sent successfully",
            token: generateToken(user._id),
            userId: user._id
        });

    } catch (error) {
        console.error("registerUser error:", error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// Login user   
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id:  user._id,
                name:user.name,
                email:user.email,
                role:user.role, 
                token:generateToken(user._id)
            });
        }else{
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getUsers };
