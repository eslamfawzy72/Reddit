# Reddit

## Project Description
- Reddit is a full-stack Reddit-like social platform that allows users to create posts, join communities, comment, chat, receive notifications, and interact with other users.  
- The project consists of a RESTful backend API built with Node.js and Express, and a frontend built with React.js.

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- React.js (Vite)

---

## Project Structure
```text 
project-root/
├── Backend/
│   ├── controllers/          # Business logic
│   ├── routes/               # API routes
│   ├── models/               # Mongoose schemas
│   ├── middleware/           # Auth & error handling
│   ├── config/               # Database & app configuration
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
│
├── Frontend/
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── main.jsx          # App entry point
│   │   ├── App.jsx           # Root React component
│   │   ├── App.css
│   │   ├── index.css
│   │
│   │   ├── assets/           # Images & static assets
│   │   │   ├── newblue.png
│   │   │   ├── react.svg
│   │   │   └── reddit.webp
│   │
│   │   ├── Components/       # Reusable UI components
│   │   │   ├── ActionBar.jsx
│   │   │   ├── Comment.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── CommunityCard.jsx
│   │   │   ├── CommunityHeader.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── SidebarLeft.jsx
│   │   │   ├── SidebarRight.jsx
│   │   │   ├── UserMenu.jsx
│   │   │   └── UserProfilePage.jsx
│   │
│   │   ├── Context/
│   │   │   └── AuthContext.jsx
│   │
│   │   ├── Full Pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Popular.jsx
│   │   │   ├── CommunityPage.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Chats.jsx
│   │   │   └── UserPage.jsx
│   │
│   │   └── styles/
│   │       ├── home.css
│   │       ├── Login.css
│   │       ├── SignUp.css
│   │       ├── PostCard.css
│   │       ├── communityPage.css
│   │       └── userProfilePage.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```
---

## Features
- User registration, login, logout (JWT authentication)
- Create, edit, delete posts
- Comment and reply system
- Communities (create, join, leave, manage moderators)
- User follow / unfollow system
- Real-time chat system
- Notifications (comments, upvotes, follows, shares)
- Polls inside posts
- Secure protected routes
- RESTful API architecture

---

## Installation and Setup

### Prerequisites
- Node.js (v18 or later recommended)
- MongoDB cluster (MongoDB Atlas)
- npm

---

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Backend will run on:

http://localhost:5000

---

## Frontend Setup
cd Frontend
npm install
npm run dev


### Frontend will run on:

http://localhost:5173

---

## Running the Project
- Start the backend first, then the frontend.
- Ensure MongoDB is running before starting the backend.


---
## Environment Variables

### Backend .env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/reddit_db
JWT_SECRET
GEMINI_API_KEY
GEMINI_API_URL

### Frontend .env

VITE_API_URL=http://localhost:5000

---


## Database

- MongoDB
- Schema designed using Mongoose
- Supports Users, Posts, Comments, Communities, Chats, Messages, Notifications

---

## Authors

- Eslam Mohamed Fawzy
- Hassan Ismail
- Adham Walid
- Mohamed Wael
- Carol Kamal
- Jana Mohamed
- Toka Elsayed
