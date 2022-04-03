//Logique de Routing

//importer express pour créer un router
const express = require('express')
const router = express.Router()
//importer les controllers depuis controllers/user
const userCtrl = require("../controllers/user");

//permettre l'enregistrement si user existe pas
router.post('/signup', userCtrl.signup)

//permettre le login is user existe
router.post('/login', userCtrl.login)

//exporter le routeur
module.exports = router;