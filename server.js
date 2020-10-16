
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes.js');
const cors = require('cors');

const app = express();
const CONNECT_STRING = 'mongodb+srv://nassadm:mkesso4798@cluster0.ut9gj.mongodb.net/test?retryWrites=true&w=majority';
/* var corsOptions = {
    origin: "http://localhost:4200"
  }; */

mongoose.connect(CONNECT_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoBD Atlas'))
    .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('<p style="text-align:center; vertical-align:middle">BIENVENU DANS LE PROJET BACK-TO-FRONT</p>'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({origin:"http://localhost:4200"}/*corsOptions*/));

app.use('/'/*'/elements'*/, router); // le contexte, la racine des chemins de routage est /elements.. analogie préfixe, indicatif

const PORT = 3000 || env.process.PORT;
app.listen(PORT, () => console.log('Le serveur en attente de requêtes sur le port: ' + PORT));