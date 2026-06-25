const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers} = require('../controllers/authController');
const { protect} = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const User = require('../models/User');



router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/users",protect,admin, getUsers);
//protect and admin are middleware 
router.post("/verify-otp", protect, async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.otp) {
      return res.status(400).json({
        message: "No OTP found"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
module.exports = router;
