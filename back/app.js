// Variables d'environnement : séparation du stockage des données sensibles
require("dotenv").config();
// console.log(process.env);

//importer Express
const express = require("express");
const app = express();
//importer mongoose + connecter avec le userTest de mongoDB
const mongoose = require("mongoose");
//importer package node pour donner accès au chemin de système de fichiers
const path = require("path");
//importer helmet (sécurité globales vulné connues)
const helmet = require("helmet");
//utiliser helmet pour protection contre vulne bien connues -> configuration d'en-têtes http
app.use(helmet());

//importer le routeur pour récupérer les middleware/routes thing
const sauceRoutes = require("./routes/sauce");
//importer le router pour récupérer les middleware/routes user
const userRoutes = require("./routes/user");

//connexion à MongoDB avec dotenv pour ne pas stocker info de connect dans le code
mongoose
  .connect(
    process.env.SECRET_BDD,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//ajouter middleware générale à notre appli pour permettre à l'app et au serv de communiquer. (eviter les CORS).
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//ajouter middleware pour intercepter les requetes avec un content type json et les mettre à dispo dans req.body (pareil que bodyParser qui donne accès au corp de la requête) --> Parsing Body
app.use(express.json());

//créer middleware pour répondre aux requêtes envoyées a /images
app.use("/images", express.static(path.join(__dirname, "images")));
//importer les routes avec le bon complément d'url en argument
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//exporter l'appli express pour l'utiliser depuis le serveur
module.exports = app;