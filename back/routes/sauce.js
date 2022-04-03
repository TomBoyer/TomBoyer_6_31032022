//Logique de Routing

//importer express
const express = require("express");
//créer un routeur pour implémenter des routes pour l'application
const router = express.Router();
//importer les controllers depuis controllers/sauces
const sauceCtrl = require("../controllers/sauce");
//importer controller de vérification/sécurité de route
const auth = require("../middleware/auth");
//importer multer
const multer = require("../middleware/multer-config");

//permettre la création d'une sauce en vérifiant l'auth
router.post("", auth, multer, sauceCtrl.createSauce);
//permettre un like / dislike sur une sauce
// router.post("/:id/like", auth, sauceCtrl.likeSauce);
//permettre la modification d'une sauce spécifique
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//permettre la suppression d'une sauce spécifique
router.delete("/:id", auth, sauceCtrl.deleteSauce);
//permettre de spécifier quelle sauce nous avons selectionné en cliquant dessus
router.get("/:id", auth, sauceCtrl.getOneSauce);
//récupérer les requêtes get, on utilise find() pour récupérer un tableau de toutes les sauces dans la base de données
router.get("", auth, sauceCtrl.getAllSauces);

//exporter le routeur
module.exports = router;