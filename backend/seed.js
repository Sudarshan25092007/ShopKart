const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model');

dotenv.config();

const sampleProducts = [
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones with active noise cancellation and 40-hour battery life.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 25
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with tactile blue switches and aircraft-grade aluminum frame.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    stock: 15
  },
  {
    name: 'Ultra-HD Smart Watch',
    description: 'Fitness tracker with AMOLED display, heart rate sensor, and waterproof design.',
    price: 3499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 20
  },
  {
    name: 'Classic Cotton Denim Jacket',
    description: 'Premium vintage washed cotton denim jacket with durable metal buttons.',
    price: 1999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    stock: 18
  },
  {
    name: 'Breathable Running Sneakers',
    description: 'Lightweight cushioned athletic sneakers designed for daily training and running.',
    price: 2499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    stock: 12
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    price: 599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    stock: 30
  },
  {
    name: 'Deep Work by Cal Newport',
    description: 'Rules for focused success in a distracted world.',
    price: 499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    stock: 22
  },
  {
    name: 'Ergonomic Memory Foam Pillow',
    description: 'Contoured cervical memory foam pillow for neck support and comfortable sleep.',
    price: 1299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    stock: 14
  }
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopkart';
  console.log('Connecting to database...');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');
  await Product.deleteMany({});
  console.log('Cleared existing products.');
  const created = await Product.insertMany(sampleProducts);
  console.log(`Successfully seeded ${created.length} products!`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
