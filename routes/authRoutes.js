
/* const express = require('express');
const authRouter = express.Router(); */

// ci-dessous raccourci des 2 lignes précédentes
const authRouter = require('express').Router();
const User = require('../model/users.js');

const Joi = require("@hapi/joi");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*const dotenv = require('dotenv');
 dotenv.config();
 CES DEUX DERNIERES LIGNES INUTILES CAR IMPORTATION (REQUIRE) ET CONFIG DEJA FAIT DANS SERVER.JS
 */

// schéma précis de validation des données reçues du client 
const inscriptionValid = Joi.object({
  login: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
})

const connexionValid = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
})

authRouter.route('/inscription').post(async (req, res) => {
  // res.send('module d\'inscription') // stub code : code pour tester la route

  // valider les données reçues du client (vérifier la conformité avec le schéma de validation)
  const dataValid = inscriptionValid.validate(req.body);
  // res.send(dataValid)

  // retourner message d'erreur si l'un des champs obligatoires est mal rempli
  if (dataValid.error)
    return res.status(400).send({ erreur: dataValid.error.details[0].message });
  // res.status(200).json({message: "validation réussie"}); // simple code de test // JSON peut remplacer SEND

  // vérifier l'unicité de l'e-mail
  const /*emailTrouve*/ userExist = await User.findOne({ email: req.body.email } /*, (err, result)=>{}*/);
  // l'absence du AWAIT cause une erreur, il m'a fallu 2h pour la résoudre

  if (userExist)
    return res.status(400).send({ erreur: "Ce e-mail est déjà utilisé, merci de choisir un autre" });

  // crypter le mot de passe
  const salt = await bcrypt.genSalt(10);
  const h_password = await bcrypt.hash(req.body.password, salt);

  // enregistrer le nouvel utilisateur
  const user = new User({
    login: req.body.login,
    email: req.body.email,
    password: h_password
  });

/*   try {
    const savedUser = await user.save();
    res.status(200).json({ error: null, data: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  } */

  /*const savedUser = // CONSTANTE INUTILE */ user.save()
    .then(data => res.status(200).json({ result: data }))
    .catch(err => res.status(400).json({ error: err }))

})

authRouter.route('/connexion').post(async (req, res) => { // POST au lieu de GET car données de formulaire à fournir
  // res.send('module de connexion actif'); // stub code : code pour tester la route

  // valider les données reçues du client
  const dataValid = connexionValid.validate(req.body);

  // retourner message d'erreur si l'un des champs obligatoires est mal rempli
  if (dataValid.error)
    return res.status(400).send({ erreur: dataValid.error.details[0].message });

  // vérifier l'existence de l'utilisateur (user) par l'e-mail (vérifier si l'e-mail est correct)
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ erreur: "E-mail ou mot de passe incorrect" });

  // vérifier la validité du password
  const passValid = await bcrypt.compare(req.body.password, user.password)
  if (!passValid)
    return res.status(400).send({ erreur: "E-mail ou mot de passe incorrect" });

  // générer un token (clé de session) et l'injecter dans l'entête de réponse
  const token = jwt.sign( /*payload: , secret:*/{ id: user._id }, process.env.SECRET);
  res.header("auth-token", token).json({ message: "connexion réussie...", token: token, user_id: user._id });
  // res.status(200).send("connexion réussie");   
  // ligne hors de portée, source d'erreur car on ne peut ENVOYER la réponse (par SEND ou JSON) qu'une fois

})

module.exports = authRouter;