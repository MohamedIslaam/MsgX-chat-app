import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

const userSchema = new mongoose.Schema({
  uname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  pwd: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  msg: { type: String, required: true },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

app.post("/signup", async (req, res) => {
  try {
    const { uname, phone, pwd } = req.body;
    let existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: "Phone already registered" });
    const newUser = new User({ uname, phone, pwd });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error in signup", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phone, pwd } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.pwd !== pwd) return res.status(400).json({ message: "Invalid password" });
    res.json({ message: "Login success", data: { uname: user.uname, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: "Error in login", error: err.message });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find({}, "uname phone");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is alive" });
});


app.post("/sendMessage", async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    const newMsg = new Message({ from, to, msg });
    await newMsg.save();
    io.to(to).emit("receiveMessage", newMsg);
    io.to(from).emit("receiveMessage", newMsg);
    res.status(201).json({ message: "Message sent", newMsg });
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
});

app.post("/getMessages", async (req, res) => {
  try {
    const { from, to } = req.body;
    const msgs = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    }).sort({ time: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

io.on("connection", (socket) => {
  socket.on("join", (phone) => {
    socket.join(phone);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
