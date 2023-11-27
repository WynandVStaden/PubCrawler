module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const router = require("express").Router();

  app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept, Authorization"
    );
    next();
  });

  /**
   * USED ROUTES
   */
  router.post("/login", users.checkLogin);
  router.post("/signup", users.doSignup);
  router.put("/reset_password", users.resetPassword);
  router.put("/edit_profile", users.editProfile);
  router.post("/share_note", users.shareNote);
  router.delete("/delete_profile", users.deleteProfile);

  /**
   * TESTING ROUTES
   */
  router.post("/generate_sample_data", users.generate_sample_data);
  router.post("/generate_cool_data", users.generate_cool_data);

  router.post("/", users.create);
  router.get("/", users.findAll);
  router.get("/username/:username", users.findOneByName);
  router.get("/email/:email", users.findOneByEmail)
  router.put("/username/:username", users.updateByUsername);
  router.put("/email/:email", users.updateByEmail);
  router.delete("/username/:username", users.deleteByUsername);
  router.delete("/email/:email", users.deleteByEmail);
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
