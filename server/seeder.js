import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Discussion from './models/Discussion.js';
import Comment from './models/Comment.js';
import Message from './models/Message.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/discussion-forum');
    console.log('📡 Connected to MongoDB for seeding...');

    // Clear
    await User.deleteMany();
    await Discussion.deleteMany();
    await Comment.deleteMany();
    await Message.deleteMany();
    console.log('🧹 Existing data successfully cleared!');

    // Create 5 standard tech profiles
    const users = await User.create([
      {
        username: 'alex_dev',
        email: 'alex@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex_dev',
      },
      {
        username: 'sara_ux',
        email: 'sara@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sara_ux',
      },
      {
        username: 'dev_hassan',
        email: 'hassan@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev_hassan',
      },
      {
        username: 'emily_ai',
        email: 'emily@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=emily_ai',
      },
      {
        username: 'cody_backend',
        email: 'cody@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cody_backend',
      },
    ]);
    console.log('👥 5 Users created successfully!');

    // Create 4 Discussions
    const discussions = await Discussion.create([
      {
        title: 'Building Premium Obsidian Glassmorphism UIs in React',
        description: 'Glassmorphism is a modern visual UI theme using high opacity contrast, subtle glowing borders, and intense backdrop-filters. What are your favorite CSS tips for creating optimized glass components in dark-mode dashboards?',
        category: 'WebDev',
        tags: ['react', 'css', 'glassmorphic', 'tailwind'],
        creator: users[1]._id, // Sara
      },
      {
        title: 'The Future of MERN & Real-Time Socket Applications',
        description: 'MERN continues to dominate web app architectures, but WebSockets via Socket.IO are redefining client-server interactions. Let us discuss performance scaling and when to use sockets vs traditional HTTP REST APIs.',
        category: 'Tech',
        tags: ['mern', 'websockets', 'socketio', 'node'],
        creator: users[0]._id, // Alex
      },
      {
        title: 'How to Land Your First Full-Stack Role in 2026',
        description: 'To stand out in the current competitive market, building a strong "proof of work" portfolio is vital. What core projects should every junior full-stack developer build to impress tech recruiters?',
        category: 'Career',
        tags: ['portfolio', 'interview', 'career', 'git'],
        creator: users[3]._id, // Emily
      },
      {
        title: 'Best Practices for MongoDB & Mongoose Database Indexes',
        description: 'Database efficiency collapses without properly structured indices. Let us discuss text-search indexes, compound indexes, and using explain() to verify query performance on Mongoose queries.',
        category: 'Database',
        tags: ['mongodb', 'mongoose', 'indexing', 'performance'],
        creator: users[4]._id, // Cody
      },
    ]);
    console.log('📑 4 Discussion threads seeded!');

    // Seed Comments (Persistent Forum Threading)
    await Comment.create([
      // Glassmorphism thread
      {
        discussion: discussions[0]._id,
        user: users[0]._id, // Alex
        text: 'Adding backdrop-filter: blur(16px) with a semi-transparent white border creates that beautiful frosted look!',
      },
      {
        discussion: discussions[0]._id,
        user: users[2]._id, // Hassan
        text: 'Remember to apply high contrast behind the glass card, otherwise the blur effect is barely visible.',
      },
      {
        discussion: discussions[0]._id,
        user: users[1]._id, // Sara
        text: 'Yes! Dynamic gradients and abstract animated blobs in the background really make glass cards pop.',
      },

      // Socket thread
      {
        discussion: discussions[1]._id,
        user: users[4]._id, // Cody
        text: 'Agreed. Using WebSockets for active chat rooms, collaboration hubs, and system monitoring dashboard ticks is critical.',
      },
      {
        discussion: discussions[1]._id,
        user: users[3]._id, // Emily
        text: 'JWT verification at socket connection handshake is also crucial to protect real-time events.',
      },

      // Career thread
      {
        discussion: discussions[2]._id,
        user: users[0]._id, // Alex
        text: 'A clean, well-documented real-time application with Socket.IO showing active typing states will secure interviews instantly.',
      },
      {
        discussion: discussions[2]._id,
        user: users[2]._id, // Hassan
        text: 'Ensure your GitHub repository has a production-ready README, interactive screenshots, and precise installation logs!',
      },
    ]);
    console.log('💬 Comments seeded!');

    // Seed Chat messages (Live Socket.IO Logs)
    await Message.create([
      {
        discussion: discussions[0]._id,
        user: users[0]._id,
        text: 'Hey everyone! Welcome to the real-time chat for glassmorphic design.',
      },
      {
        discussion: discussions[0]._id,
        user: users[1]._id,
        text: 'Hey Alex! Glad to be here. The live socket connection feels instant.',
      },
      {
        discussion: discussions[0]._id,
        user: users[2]._id,
        text: 'This dashboard layout looks absolutely brilliant!',
      },
      {
        discussion: discussions[1]._id,
        user: users[4]._id,
        text: 'Hello guys. Let us discuss the scalability of Socket.IO nodes.',
      },
      {
        discussion: discussions[1]._id,
        user: users[0]._id,
        text: 'Using Redis adapter enables excellent horizontally scaled socket servers.',
      },
    ]);
    console.log('📨 Live chat transcripts seeded successfully!');
    console.log('✅ DATABASE FULLY SEEDED!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
