const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv");
env.config();
const conversationRouter = require('../routes/ai.routes')

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/conversation', conversationRouter);

module.exports = app;