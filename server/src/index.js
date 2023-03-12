const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const colors = require('colors');
const port = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.all('*', (req, res) => {
    return res.status(404).json({
        message: 'Router not found',
        path: req.originalUrl,
    });
});
app.listen(port, () => {
    console.log(colors.green(`Server listening on http://localhost:${port}`));
});
