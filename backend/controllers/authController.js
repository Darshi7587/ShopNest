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
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //TODOS: Hash the password before saving to the database
        //TODOS: Implement JWT token generation for authentication
        //TODOS:OTP sending and verification for email confirmation
        //TODO:Welcome email sending after successful registration
        const user = await User.create({ name, email, password: hashedPassword });
        if(user){
            const otp=Math.floor(100000 + Math.random() * 900000).toString();
            const message=`Welcome to ShopNest!,${name} Thank You for registering with us.we are excited to have you on board. Your OTP for registration is: ${otp}`;

            await sendEmail(email,"Welcome to ShopNest!-Your OTP for Registration",message);
            res.status(201).json({ 
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
             });
        }
        else{
            res.status(400).json({ message: "Invalid user data" });
        }
       
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({ message: "Server error" });
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
