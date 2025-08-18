const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const User = require('./models/User');

app.post('/api/login', async (req, res) => {
  const { clerkId, email, name } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ error: 'Missing user data' });
  }

  try {
    console.log("Received login data:", req.body); // <-- debug

    // Check if user exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ clerkId, email, name });
      console.log("User created:", user); // <-- debug
    } else {
      console.log("User already exists:", user); // <-- debug
    }

    res.json({ success: true, user });
  } catch (e) {
    console.error("Error saving user:", e); // <-- detailed logging
    res.status(500).json({ error: 'Failed to save user', details: e.message });
  }
});


// ----- Health Check -----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ----- Student Routes -----
const studentRoutes = require('./routes/StudentRoutes');
app.use('/api/students', studentRoutes);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
}

start();
