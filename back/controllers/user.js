//controllers : Logique métier

//importer package de cryptage de mdp
const bcrypt = require("bcrypt");

//importer package pour créer token/modifier token
const jwt = require("jsonwebtoken");

//importer model user
const User = require("../models/user");

//middleware pour l'enregistrement
exports.signup = (req, res, next) => {
  //hasher le mdp pour le crypter : 10 tours de logiciel
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//middleware pour connecter des users existants
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "user non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "mdp incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              //verification que c'est le bon user avec son id
              { userId: user._id },
              //clef de cryptage
              "RANDOM_TOKEN_SECRET",
              //durée de vie token
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};