require('dotenv').config();   // MUST BE FIRST

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authroutes'); // Importing auth routes
const reportRoutes = require('./routes/reportroutes'); // Importing report routes
const folderRoutes = require('./routes/folderRoutes'); // Importing folder routes

const app = express();

// Enable CORS for frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/folders', folderRoutes);

app.get('/', (req, res) => {
    res.send("MediVault API Running");
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Error connecting to MongoDB", err));

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
