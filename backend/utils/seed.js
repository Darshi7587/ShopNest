require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedUsers = [
	{
		name: 'Admin User',
		email: 'admin@shopnest.com',
		password: 'Admin12345',
		role: 'admin',
		verified: true,
	},
	{
		name: 'Demo User',
		email: 'user@shopnest.com',
		password: 'User12345',
		role: 'user',
		verified: true,
	},
];

const seedProducts = [
	{
		name: 'Wireless Headphones',
		description: 'Noise-cancelling over-ear headphones with deep bass and long battery life.',
		price: 4999.99,
		category: 'electronics',
		stock: 12,
		imageUrl: 'https://example.com/headphones.jpg',
		ratings: 4.6,
		numReviews: 128,
	},
	{
		name: 'Smart Watch',
		description: 'Fitness tracking smartwatch with heart rate monitoring and notifications.',
		price: 6999.0,
		category: 'electronics',
		stock: 20,
		imageUrl: 'https://example.com/smartwatch.jpg',
		ratings: 4.4,
		numReviews: 89,
	},
	{
		name: 'Laptop Stand',
		description: 'Adjustable aluminum laptop stand for better posture and cooling.',
		price: 1499.5,
		category: 'accessories',
		stock: 35,
		imageUrl: 'https://example.com/laptop-stand.jpg',
		ratings: 4.8,
		numReviews: 54,
	},
];

const seed = async () => {
	try {
		await connectDB();
		console.log('MongoDB connected successfully for seeding');

		const existingUsers = await User.find({ email: { $in: seedUsers.map((user) => user.email) } });
		const existingProducts = await Product.find({ name: { $in: seedProducts.map((product) => product.name) } });

		const usersByEmail = new Map(existingUsers.map((user) => [user.email, user]));
		const productsByName = new Map(existingProducts.map((product) => [product.name, product]));

		const usersToCreate = [];
		for (const user of seedUsers) {
			if (!usersByEmail.has(user.email)) {
				usersToCreate.push({
					...user,
					password: await bcrypt.hash(user.password, 10),
				});
			}
		}

		const productsToCreate = seedProducts.filter((product) => !productsByName.has(product.name));

		const createdUsers = usersToCreate.length ? await User.insertMany(usersToCreate) : [];
		const createdProducts = productsToCreate.length ? await Product.insertMany(productsToCreate) : [];

		const allUsers = [...existingUsers, ...createdUsers];
		const allProducts = [...existingProducts, ...createdProducts];
		const demoUser = allUsers.find((user) => user.email === 'user@shopnest.com');

		if (demoUser && allProducts.length >= 2) {
			const existingDemoOrder = await Order.findOne({ paymentId: 'pay_demo_123456' });

			if (!existingDemoOrder) {
			await Order.create({
				user: demoUser._id,
				products: [
					{
						product: allProducts[0]._id,
						qty: 1,
						price: allProducts[0].price,
					},
					{
						product: allProducts[1]._id,
						qty: 2,
						price: allProducts[1].price,
					},
				],
				totalAmount: allProducts[0].price + allProducts[1].price * 2,
				address: {
					fullName: 'Demo User',
					street: '123 Market Street',
					city: 'Mumbai',
					postalCode: '400001',
					country: 'India',
				},
				paymentId: 'pay_demo_123456',
				status: 'Pending',
			});
			}
		}

		console.log('Seed completed successfully');
		console.log(`Users inserted: ${createdUsers.length}`);
		console.log(`Products inserted: ${createdProducts.length}`);
		console.log(existingUsers.length + createdUsers.length > 0 ? 'Orders inserted: 1 or already existed' : 'Orders inserted: 0');
	} catch (error) {
		console.error('Seed failed:', error);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
	}
};

if (require.main === module) {
	seed();
}

module.exports = seed;
