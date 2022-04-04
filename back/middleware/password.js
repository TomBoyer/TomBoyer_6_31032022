//importer password validator
const passwordValidator = require("password-validator");

//créer schéma de validation pour les mdp (efficacité)
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
  .oneOf(["Passw0rd", "Password123", "M0tdepasse"]);

//exporter schéma password
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        "Le mot de passe doit contenir : min 8 caractères, 1maj, 1min, 1chiffres, pas d'espaces, ne doit pas être trop simple",
    });
  } else {
    next();
  }
};
