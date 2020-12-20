
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const router = require('./routes.js');
const router = require('./routes/index.js');
const authRouter = require('./routes/authRoutes.js');
const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

const app = express();

/* var corsOptions = {
    origin: "http://localhost:4200"
  }; */

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoBD Atlas'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('<p style="text-align:center; vertical-align:middle">BIENVENU DANS LE PROJET BACK-TO-FRONT</p>'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({origin:"http://localhost:4200"}/*corsOptions*/));

app.use('/'/*'/elements'*/, router); // le contexte, la racine des chemins de routage est /elements.. analogie préfixe, indicatif
app.use('/auth', authRouter);

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log('Le serveur en attente de requêtes sur le port: ' + PORT));