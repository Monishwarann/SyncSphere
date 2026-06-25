# SyncSphere 🌐 | Premium Community Forum & Real-Time Chat

A high-performance, production-ready **Full-Stack (MERN + Socket.IO) Discussion Platform** built to showcase modern software engineering, responsive glassmorphic UI systems, and robust real-time communications.

Developed by **[Monishwaran K](https://github.com/Monishwarann)** as a portfolio-grade MERN showcase project.

---

## 📌 Copy-Paste Repository Details for GitHub

When publishing this project on GitHub, use these optimized metadata values to attract tech recruiters and developers:

* **Repository Name**: `Full-stack-Development-Community-Discussion-Forum-with-Real-Time-Chat`
* **Short Description**:
  > A state-of-the-art MERN + Socket.IO community discussion forum and live chatroom platform featuring obsidian glassmorphism, instant websockets room syncing, and persistent comment threads.
* **Topics (Tags)**: `mern-stack`, `socketio`, `react`, `nodejs`, `express`, `mongodb`, `realtime-chat`, `glassmorphism`, `fullstack-developer`, `websockets`, `jwt-authentication`, `javascript`

---

## 🎨 Visual Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## 🚀 Architectural Blueprint

SyncSphere separates asynchronous knowledge archives (persistent database-driven forum comments) from synchronous interactive conversations (low-latency WebSockets room chats) side-by-side:

```
[ Client: React (Vite) ] <--- HTTP REST API ---> [ Server: Node/Express ] <---> [ MongoDB ]
           |                                             |
     (Socket.IO) <---------- Duplex WebSocket ---------> (Socket.IO)
```

### Core Operations Flow
1. **JWT Verification**: Profile Sign-ups/Logins $\rightarrow$ server hashes passwords using `bcryptjs` $\rightarrow$ signs a stateless **JSON Web Token (JWT)** $\rightarrow$ browser stores token in LocalStorage.
2. **Axios Interceptor**: Client routes make HTTP REST calls, automatically attaching verified JWT Authorization Bearer headers for protected resources.
3. **Double-Engine Collaboration**: When opening a discussion thread:
   - Persistent comments populate the forum board instantly via MongoDB fetching.
   - A concurrent WebSocket connection upgrades the transaction to a full-duplex Socket.IO room channel.
   - Server tracks connections, broadcasting dynamic membership arrays, active typing indicators, and message cards in real time under 15ms.

---

## 🛠️ System Design Features

* **Frosted Obsidian Glassmorphism UI**: Beautiful semi-transparent glass cards (`backdrop-filter: blur(14px)`), smooth CSS animations, dark backdrops with glowing gradient highlights, and modern thin scrollbars.
* **Auto-Shimmer Loading Skeletons**: Custom CSS keyframes display shifting loaders on list feeds and detail boards during database fetching, eliminating jarring layout jumps.
* **Typing Indication Alerts**: Bouncing loading bubbles show exactly when room participants are drafting responses, boosting user engagement.
* **Pulsing Connectivity Widgets**: Sticky Navbar highlights connection status, toggling instantly between WebSockets synchronization modes.
* **Referential Database Cascades**: Server automatically runs recursive Mongoose cascades on thread deletes, cleaning all related comment tables and chat logs to eliminate orphaned space.

---

## 📂 Repository Directory Tree

```
Community-Discussion-Forum-RealTime-Chat/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Favicons and static assets
│   ├── src/
│   │   ├── components/         # Reusable UI widgets (Navbar, Toast, StatsSection, LoadingSkeleton)
│   │   ├── pages/              # Viewports (Login, Register, Dashboard, Create, Details)
│   │   ├── services/           # Axios interceptors pointing to backend API
│   │   ├── sockets/            # Client Socket.IO configuration singleton
│   │   ├── index.css           # Global Tailwind and obsidian glassmorphism utilities
│   │   ├── App.jsx             # Router layouts and dynamic Toast states
│   │   └── main.jsx            # React rendering mount
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express + Socket.IO Backend
│   ├── config/                 # Database Mongoose connection parameters
│   ├── controllers/            # Logic files (authentication, threads, comments, messages)
│   ├── middleware/             # Route guards and custom error handlers
│   ├── models/                 # Mongoose schemas (User, Discussion, Comment, Message)
│   ├── routes/                 # REST Router endpoint definitions
│   ├── sockets/                # Socket.IO connection rooms, typing, and roster event systems
│   ├── seeder.js               # Auto-seeding database initialization script
│   ├── server.js               # Application bootstrap
│   ├── .env.example            # Environment template configuration
│   └── package.json
│
├── README.md                   # Operations guide
└── .gitignore                  # Git commit exclusions
```

---

## ⚙️ REST API Endpoints Index

### 🔐 Authentication Router (`/api/auth`)
* `POST /register` - Register new profile $\rightarrow$ returns profile & signs JWT.
* `POST /login` - Signin credentials $\rightarrow$ returns profile & signs JWT.
* `GET /profile` - Retrieve caller's verified details. *(Protected)*

### 📑 Discussions Router (`/api/discussions`)
* `POST /` - Seed a new discussion (Title, Description, Category, Tags) $\rightarrow$ returns populated object. *(Protected)*
* `GET /` - List all discussions (supports text-search query, category tags filter).
* `GET /:id` - Get thread details (populates creator details).
* `DELETE /:id` - Cascade deletes discussion thread and comments. *(Protected, Creator only)*

### 💬 Forum Comments Router (`/api/comments`)
* `POST /:discussionId` - Post a persistent answer to a thread. *(Protected)*
* `GET /:discussionId` - List all comments on this thread in chronological order.

### 📨 Live Chat History Router (`/api/messages`)
* `GET /:discussionId` - Retrieve last 50 live chat room messages for initial render. *(Protected)*

---

## 🔌 Socket.IO Live Events Schema

| Client Emits Event | Server Action | Broadcasts Response Event |
| :--- | :--- | :--- |
| `join-room` | Subscribes socket to room ID; caches user to active memory. | `room-users` $\rightarrow$ Relays updated user lists to room. |
| `send-message` | Logs message to database. | `receive-message` $\rightarrow$ Relays full user-populated chat bubble to room. |
| `typing` | Identifies active typing author. | `user-typing` $\rightarrow$ Displays bouncing loading indicator. |
| `stop-typing` | Removes typing author state. | `user-stop-typing` $\rightarrow$ Hides bouncing loading indicator. |
| `leave-room` | Unsubscribes socket from room; removes user from active memory. | `room-users` $\rightarrow$ Relays updated user lists to room. |
| `disconnect` | Auto-purges user from all active memory room keys. | `room-users` $\rightarrow$ Relays updated user lists to room. |

---

## 🛠️ Step-by-Step Installation & Local Launch

### 1. Database Prerequisite
Ensure a local instance of **MongoDB** is running on your machine:
* Default address: `mongodb://127.0.0.1:27017/discussion-forum`
* Or retrieve a free connection string from MongoDB Atlas.

### 2. Configure Backend Server
Navigate to the server directory, install dependencies, and create the environment file:
```bash
cd server
npm install

# Create local environment config
copy .env.example .env   # (Windows)
cp .env.example .env     # (macOS/Linux)
```
Verify the contents of the newly created `.env` match your local configurations:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/discussion-forum
JWT_SECRET=supersecretkey
NODE_ENV=development
```

### 3. Automatically Seed Database (Highly Recommended)
Launch the auto-seeder script to instantly populate the database with realistic mock data (5 developer profiles, 4 threads, comments, and live chat logs):
```bash
npm run seed
```
*Expected log output:*
```
📡 Connected to MongoDB for seeding...
🧹 Existing data successfully cleared!
👥 5 Users created successfully!
📑 4 Discussion threads seeded!
💬 Comments seeded!
📨 Live chat transcripts seeded successfully!
✅ DATABASE FULLY SEEDED!
```

### 4. Boot Backend Server
```bash
npm run dev
```
The server will boot on port `5000` with WebSocket listeners connected:
```
📡 MongoDB Connected: 127.0.0.1
🚀 Server running on port 5000
```

### 5. Launch Frontend Client
In a new terminal window, navigate to the client folder, install dependencies, and start Vite:
```bash
cd client
npm install
npm run dev
```
Vite will host the web application on:
* **Local URL**: `http://localhost:5173/`

---

## 🔮 Interactive Virtual Simulation Guide
To visually verify real-time capabilities for your portfolio:
1. **Launch Two Separate Browser Windows** (e.g. Chrome and Edge, or one in Incognito Mode).
2. **Access the Application**: Open [http://localhost:5173/](http://localhost:5173/) on both.
3. **Register/Login User A**: Sign in on Window A using seeded credentials:
   - Email: `alex@example.com` | Password: `password123`
4. **Register/Login User B**: Sign in on Window B using seeded credentials:
   - Email: `sara@example.com` | Password: `password123`
5. **Open the same thread** (e.g. *"Building Premium Obsidian Glassmorphism UIs in React"*).
6. **Observe Sockets Actions**:
   - The online counter instantly increments to `2 online`.
   - The active users ribbon showcases both avatars and profiles.
   - Start typing in Window A: Window B instantly displays `alex_dev is typing...` with a bouncing bubble animation.
   - Send a message in Window A: The message bubble immediately slides up in both viewports with ultra-low latency.

---

## 👤 Developer Profile

* **Name**: Monishwaran K  
* **GitHub Profile**: [@HarshalNavale45](https://github.com/Monishwarann)  

Feel free to open issues or pull requests to enhance the platform!
