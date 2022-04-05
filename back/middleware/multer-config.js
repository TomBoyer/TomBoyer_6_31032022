//importer multer : gestion de fichiers envoyés avec req http
const multer = require("multer");

//traduire l'extension
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//créer objet de config multer : empêcher les espaces, ajouter extensions, ajouter la date pour rendre chaque file unique
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //pas d'espace dans le nom du file -> remplacé par _
    const name = file.originalname.split(" ").join("_");
    //accès à mimetype grâce à la trad plus haut
    const extension = MIME_TYPES[file.mimetype];
    //création nom + time-stamp + extension
    callback(null, name + Date.now() + "." + extension);
  },
});

//exporter en précisant qu'il s'agit d'une image unique
module.exports = multer({ storage: storage }).single("image");