//controllers : Logique métier

//importer le model créé dans model/sauce.js
const Sauce = require("../models/sauce");
//importer package node fs (filesysteme) pour acceder aux opérations du système de fichier
const fs = require("fs");

//get all sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//get one sauces
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// post créer une sauce
exports.createSauce = (req, res, next) => {
  //supprimer l'id généré automatiquement par mongoDB
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    //gérer l'url de façon dynamique : le protocole (http ou https), l'host, le dossier, le nom du fichier
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  //enregistrer la sauce dans la base de données : base de données fractionnées en collections (Sauces)
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//delete supprimer une sauce !important => seulement si userID === user de la req
exports.deleteSauce = (req, res, next) => {
  //vérifier que le user est bien le proprio de la sauce à suppr
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    //vérifier que le user possède une sauce
    if (!sauce) {
      return res.status(404).json({ error: new Error("sauce non trouvée") });
    }
    //vérifier que le userId de la sauce est bien le même que le user qui veut la delete
    if (sauce.userId !== req.auth.userId) {
      return res.status(401).json({
        error: new Error("Requête non autorisée"),
      });
    }
    //récupérer url de l'image pour avoir son nom et la delete de la bdd
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  });
};

//put modifier une sauce
exports.modifySauce = (req, res, next) => {
  //nouvelle images ou non ? si oui req.file si non traiter object directement
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //use l'_id dans la req pour trouver la sauce à modifier avec le meme _id que l'original sans en créer une nouvelle
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// //post like/dislike d'une sauce
// exports.likeSauce = (req, res, next) => {
//   console.log(req.body);
//   //input like
//   const like = req.body.like
//   //url de la sauce
//   const sauceID = req.params.id
// }
