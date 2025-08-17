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

// ----- Login Route -----
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Login successful
    return res.json({ success: true, token: "logged-in" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set. Create a .env file based on .env.example');
  process.exit(1);
}

// ----- Mongoose Model -----
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  paid: { type: Boolean, default: false },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// ----- Routes -----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// List students (optionally sort)
app.get('/api/students', async (req, res) => {
  try {
    const { sort } = req.query;
    let sortQuery = {};
    if (sort === 'paymentStatus') {
      // unpaid first (paid: false -> 0, paid: true -> 1)
      sortQuery = { paid: 1, name: 1 };
    } else if (sort === 'name') {
      sortQuery = { name: 1 };
    } else if (sort === 'createdAt') {
      sortQuery = { createdAt: -1 };
    }
    const students = await Student.find({}).sort(sortQuery);
    res.json(students);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add student
app.post('/api/students', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    const student = await Student.create({ name: name.trim() });
    res.status(201).json(student);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update student (paid / name)
app.patch('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, paid } = req.body;
    const update = {};
    if (typeof name === 'string') update.name = name.trim();
    if (typeof paid === 'boolean') update.paid = paid;

    const student = await Student.findByIdAndUpdate(id, update, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student (optional)
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Student.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Payment details (unpaid first then paid)
app.get('/api/payments', async (req, res) => {
  try {
    const unpaid = await Student.find({ paid: false }).sort({ name: 1 });
    const paid = await Student.find({ paid: true }).sort({ name: 1 });
    res.json({ unpaid, paid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

// ----- Start -----
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
