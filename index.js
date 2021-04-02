require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello Backend!</h1>');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
