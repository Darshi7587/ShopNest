const User = require("../model/User");

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
         //TODOS: Hash the password before saving to the database
         //TODOS: Implement JWT token generation for authentication
         //TODOS:OTP sending and verification for email confirmation
         //TODO:Welcome email sending after successful registration
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
