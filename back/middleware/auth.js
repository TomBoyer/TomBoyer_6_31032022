//middleware qui vérifie le token (valable ? + userId send avec = deja prit donc check avec token si bon userId) envoyé par le front (requete)

//importer package pour créer token/modifier token => vérifier ici
const jwt = require("jsonwebtoken");
// Variables d'environnement : séparation du stockage des données sensibles
require("dotenv").config();

module.exports = (req, res, next) => {
  //vérifier chaque lignes => 0 error
  try {
    //récupérer le token dans le header : authorisation
    const token = req.headers.authorization.split(" ")[1];
    //décoder le token avec la clef secrete du middleware controller/user
    const decodedToken = jwt.verify(token, process.env. SECRET_TOKEN);
    //récupérer le userId dans le token décrypté
    const userId = decodedToken.userId;
    //ajouter le userId à la requête pour protéger de la suppresion par un user unvalable
    req.auth = {userId : userId};
    //si userId envoyé avec la requête vérifier que ça correspond avec le token
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
    //si error => gérer ici
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};