const express = require('express');
const { aiController } = require('../controllers/ai.controller');

const router = express.Router();


router.post("/experiment", aiController);

module.exports = router;
