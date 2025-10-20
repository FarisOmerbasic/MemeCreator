const express = require('express');
const cors = require('cors');
const configRouter = require('../routes/config');
const memeRouter = require('../routes/meme');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api', configRouter);
app.use('/api', memeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});