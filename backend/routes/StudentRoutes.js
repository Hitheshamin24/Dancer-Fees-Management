const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ----- Student Schema -----
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  paid: { type: Boolean, default: false },
  clerkId: { type: String, required: true }, // associate student with Clerk user
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// ----- Routes -----

// List students (optionally sort)
router.get('/', async (req, res) => {
  try {
    const { sort, clerkId } = req.query;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    let sortQuery = {};
    if (sort === 'paymentStatus') sortQuery = { paid: 1, name: 1 };
    else if (sort === 'name') sortQuery = { name: 1 };
    else if (sort === 'createdAt') sortQuery = { createdAt: -1 };

    const students = await Student.find({ clerkId }).sort(sortQuery);
    res.json(students);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add student
router.post('/', async (req, res) => {
  try {
    const { name, clerkId } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const student = await Student.create({ name: name.trim(), clerkId });
    res.status(201).json(student);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update student (paid / name)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, paid, clerkId } = req.body;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const update = {};
    if (typeof name === 'string') update.name = name.trim();
    if (typeof paid === 'boolean') update.paid = paid;

    // Only update if the student belongs to this clerkId
    const student = await Student.findOneAndUpdate({ _id: id, clerkId }, update, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found or unauthorized' });

    res.json(student);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clerkId } = req.body; // send clerkId in body
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const result = await Student.findOneAndDelete({ _id: id, clerkId });
    if (!result) return res.status(404).json({ error: 'Student not found or unauthorized' });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Payment details
router.get('/payments', async (req, res) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const unpaid = await Student.find({ clerkId, paid: false }).sort({ name: 1 });
    const paid = await Student.find({ clerkId, paid: true }).sort({ name: 1 });

    res.json({ unpaid, paid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

module.exports = router;
