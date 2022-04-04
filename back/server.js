//importer http
const http = require("http");
//importer l'appli express
const app = require("./app");

//la fonction normalizePort renvoie un port valide, qu'il soit fournit sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//indiquer à l'app sur quel port tourner 
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur 
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//créer serveur avec le paramètre de l'application importée
const server = http.createServer(app);

//un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on("error", errorHandler);
//écouter sur quel port le server s'execute
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

//ecouter le port du serveur
server.listen(port);