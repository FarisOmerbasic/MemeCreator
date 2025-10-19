const express = require('express');
const configRouter = require('../routes/config');
const memeRouter = require('../routes/meme');

const app = express();

app.use(express.json());

app.use('/api', configRouter);
app.use('/api', memeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});