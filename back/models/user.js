//créer un model user qui sera importé ailleurs pour la création d'un nouveau user

//importer mongoose
const mongoose = require("mongoose");
//plugin validator pour user unique
const uniqueValidator = require("mongoose-unique-validator");

//créer un schema de création avec les diffférents types et champs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//appeler le plugin de validation user
userSchema.plugin(uniqueValidator);

//exporter le model de schema pour importation depuis l'app
module.exports = mongoose.model("User", userSchema);