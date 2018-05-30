var shell = require("shelljs");

shell.exec("nodemon -w ./server -w ./start.js --exec node ./start.js");