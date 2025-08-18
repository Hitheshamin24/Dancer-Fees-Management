const User = require('./models/User');
const { users } = require('@clerk/clerk-sdk-node'); // If using Clerk SDK

app.post('/api/login', async (req, res) => {
  const { clerkId, email, name } = req.body; // info from Clerk frontend

  try {
    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      // If user doesn't exist, create it
      user = await User.create({ clerkId, email, name });
    }

    // Return success (you can also generate your own token)
    res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to log in" });
  }
});
