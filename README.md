# MsgX

A real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Users can sign up, log in, and chat with other registered users in real-time.

## Features

* User authentication (Signup & Login)
* View a list of all registered users
* Select a user to start a conversation
* Real-time messaging using **Socket.IO**
* Messages are stored in **MongoDB**
* Search users by name
* Responsive design for desktop and mobile

## Tech Stack

| Layer       | Technology             |
| ----------- | ---------------------- |
| Frontend    | React, CSS             |
| Backend     | Node.js, Express       |
| Database    | MongoDB (via Mongoose) |
| Real-time   | Socket.IO              |
| HTTP Client | Axios                  |

## Folder Structure

```
/chat-app
│
├─ /frontend
|   ├─/public
|   ├─/src
│     ├─ /components   # All React components (Login, Signup, Dashboard)
│     ├─ App.js
│     └─ MyProvi.js    # Context API provider
│
├─ /backend
│   └─ server.js      # Server & Socket.IO setup
│
└─ README.md
```

## Setup Instructions

1. Clone the repo:

   ```bash
   git clone https://github.com/MohamedIslaam/MsgX-chat-app.git
   ```
2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:

   ```bash
   cd ..
   cd frontend
   npm install
   ```
4. Create a `.env` file in the backend folder with:

   ```
   MONGO_URI=<your_mongo_connection_string>
   PORT=5000
   ```
5. Run the backend:

   ```bash
   cd backend
   node server.js
   ```
6. Run the frontend:

   ```bash
   cd ..
   cd frontend
   npm start
   ```
7. Open the app at http://localhost:3000

## Notes

* Messages are stored in MongoDB and retrieved via API.
* Real-time updates are powered by **Socket.IO**.
* Responsive design ensures usability on mobile and desktop.
