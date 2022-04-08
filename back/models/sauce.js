//importer mongoose
const mongoose = require("mongoose");

//créer un schéma de création d'une sauce avec les champs et types
const sauceSchema = mongoose.Schema({
  //gérer les sauces
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  //gérer les likes et dislikes
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, 'default': [] },
  usersDisliked: { type: Array, 'default': [] },
});

//exporter le model de schema pour importation depuis l'app
module.exports = mongoose.model("Sauce", sauceSchema);
