const Sauce = require("../models/sauce");

//6. post like/dislike d'une sauce
exports.likeSauce = (req, res, next) => {
  // console.log(req.body, 'ctrl like : affichage userId + like dans le body');
  // console.log(req.params, 'ctrl like : id dans l'url de la req');
  // console.log(req.params.id, 'mise au format de l'id de la sauce')

  //récupérer : input like
  const like = req.body.like;
  //récupérer : url de la sauce
  const sauceId = req.params.id;
  //récupérer : userId
  const userId = req.body.userId;

  //méthode JS includes()
  //opérateur mongoDB $inc : incrémente
  //opérateur mongoDB $push : envoie
  //opérateur mongoDB $pull : retire

  switch (like) {
    //like = 1 = user aime
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { likes: +1 },
          $push: { usersLiked: userId },
        }
      )
        .then(() => res.status(201).json({ message: "Like +1" }))
        .catch((error) => res.status(400).json({ error }));
      break;

    //like = 0 = user annule like
    //findOne pour check si like/dislike présent ou non
    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          //si userId est dans userLiked => suppr le like +1
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId },
              }
            )
              .then(() =>
                res.status(201).json({ message: "remove du like +1" })
              )
              .catch((error) => res.status(400).json({ error }));

            //sinon si userId est dans usersDisliked => suppr le dislike +1
          } else if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            )
              .then(() =>
                res.status(201).json({ message: "remove du dislike +1" })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(400).json({ message: "echec de requête" });
          }
        })
        .catch((error) =>
          res.status(404).json({ message: "aucune sauce présente" })
        );
      break;

    //like = -1 = user n'aime pas
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: +1 },
          $push: { usersDisliked: userId },
        }
      )
        .then(() => res.status(201).json({ message: "Dislike +1" }))
        .catch((error) => res.status(400).json({ error }));
    default:
      break;
  }
};
