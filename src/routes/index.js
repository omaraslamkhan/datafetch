const express = require("express");
const controller = require("../controller/builder.controller");
const router = express.Router();

let routes = (app) => {
    // router.post("/upload", controller.upload);
    // router.get("/files", controller.getListFiles);
    // router.get("/files/:name", controller.download);
     router.post("/adusers", controller.getADUsers);

    router.get("/departments", controller.getDpt);
    router.get("/users", controller.getUsers);
    router.get("/meetings", controller.getMeetings);
  
    app.use(router);
  };
  
  module.exports = routes;