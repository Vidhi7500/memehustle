const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { text } = req.body;

  // Dummy response for now
  res.json({ message: `Meme generated with text: ${text}` });
});

module.exports = router;
