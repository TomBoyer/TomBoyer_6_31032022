//controllers : Logique métier

//importer le model créé dans model/sauce.js
const Sauce = require("../models/sauce");
//importer package node fs (filesysteme) pour acceder aux opérations du système de fichier
const fs = require("fs");

//1. get all sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//2. get one sauces
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//3. post créer une sauce
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

//4. delete supprimer une sauce !important => seulement si userId === user de la req
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

//5. put modifier une sauce
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
  //delet l'ancienne pic pour ne pas surcharger doc img
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      //use l'_id dans la req pour trouver la sauce à modifier avec le meme _id que l'original sans en créer une nouvelle
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

// //6. post like/dislike d'une sauce
// exports.likeSauce = (req, res, next) => {
//   // console.log(req.body, 'ctrl like : affichage userId + like dans le body');
//   // console.log(req.params, 'ctrl like : id dans l'url de la req');
//   // console.log(req.params.id, 'mise au format de l'id de la sauce')

//   //récupérer : input like
//   const like = req.body.like;
//   //récupérer : url de la sauce
//   const sauceId = req.params.id;
//   //récupérer : userId
//   const userId = req.body.userId;

//   //méthode JS includes()
//   //opérateur mongoDB $inc
//   //opérateur mongoDB $push
//   //opérateur mongoDB $pull

//   switch (like) {
//     //like = 1 = user aime
//     case 1:
//       Sauce.updateOne(
//         { _id: sauceId },
//         {
//           $inc: { like: +1 },
//           $push: { usersLiked },
//         }
//       )
//         .then(() => res.status(201).json({ message: "Like +1" }))
//         .catch((error) => res.status(400).json({ error }));
//       break;

//     //like = -1 = user n'aime pas
//     case -1:
//       Sauce.updateOne(
//         { _id: sauceId },
//         {
//           $inc: { like: +1 },
//           $push: { usersDisliked },
//         }
//       )
//         .then(() => res.status(201).json({ message: "Like -1" }))
//         .catch((error) => res.status(400).json({ error }));
//       break;

//     //like = 0 = user annule like
//     //findOne pour check si like/dislike présent ou non
//     case 0:
//       Sauce.findOne({ _id: sauceId })
//         .then((sauce) => {
//           //si userId est dans userLiked => suppr le like +1
//           if (sauce.usersLiked.includes(userId)) {
//             Sauce.updateOne(
//               { _id: sauceId },
//               {
//                 $inc: { like: -1 },
//                 $pull: { usersLiked },
//               }
//             )
//               .then(() =>
//                 res.status(201).json({ message: "remove du like +1" })
//               )
//               .catch((error) => res.status(400).json({ error }));

//             //sinon si userId est dans usersDisliked => suppr le dislike +1
//           } else if (sauce.usersDisliked.includes(userId)) {
//             Sauce.updateOne(
//               { _id: sauceId },
//               {
//                 $inc: { like: -1 },
//                 $pull: { usersDisliked },
//               }
//             )
//               .then(() =>
//                 res.status(201).json({ message: "remove du dislike +1" })
//               )
//               .catch((error) => res.status(400).json({ error }));
//           }
//         })
//         .catch((error) =>
//           res.status(404).json({ message: "aucune sauce présente" })
//         );
//       break;

//     default:
//       break;
//   }
// };
