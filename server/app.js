const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const aiRoutes = require("./routes/aiRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/commit', require('./routes/commitRoutes'));
app.use("/api/ai", aiRoutes);
app.use('/api/motivation', require('./routes/motivationRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
