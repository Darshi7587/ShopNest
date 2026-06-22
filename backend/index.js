const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("ShopNest backend is working properly!");
});

app.use('api/auth', require('./routes/authRoutes'));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
