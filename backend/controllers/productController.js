const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        console.log("getProductById called with id:", req.params.id);
        const product = await Product.findById(req.params.id);
        console.log("Product found:", product);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error("getProductById error:", error.message);
        res.status(500).json({ message: "Server error" });
    }   
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        console.log("Creating product with body:", { name, description, price, category, stock });
        console.log("File received:", req.file);
        
        let imageUrl = '';
        if(req.file){
            try {
                console.log("Uploading to cloudinary, file path:", req.file.path);
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log("Cloudinary result:", result);
                imageUrl = result.secure_url;
            } catch (cloudinaryError) {
                console.warn("Cloudinary upload failed:", cloudinaryError.message, "- proceeding without image");
            }
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("createProduct error:", error.message);
        console.error("Full error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        console.log("updateProduct called with id:", req.params.id);
        console.log("updateProduct body:", { name, description, price, category, stock });
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if(req.file){
                try {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    console.log(result);
                    product.imageUrl = result.secure_url;
                } catch (cloudinaryError) {
                    console.warn("Cloudinary upload failed:", cloudinaryError.message);
                }
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) { 
        console.error("updateProduct error:", error.message);
        console.error("Full error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product removed" });
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }   
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
