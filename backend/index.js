const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("ShopNest backend is working properly!");
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
