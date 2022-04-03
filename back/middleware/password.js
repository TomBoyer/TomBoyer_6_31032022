//importer password validator
const passwordValidator = require("password-validator");

//créer schéma de validation pour les mdp
const passwordSchema = new passwordValidator();
//ajouter propriétés au schéma
passwordSchema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase(1)
  .has()
  .lowercase(1)
  .has()
  .digits(1)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

//exporter schéma password
module.exports = passwordSchema;
