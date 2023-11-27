const categories = require("../controllers/category.controller");
module.exports = app => {
    const categories = require("../controllers/category.controller.js");
    const router = require("express").Router();

    /**
     * USED ROUTES
     */
    router.post("/create_category", categories.createCategory);
    router.get("/get_notes_of_type", categories.getNotesOfType);
    router.get("/get_all_types", categories.findAllTypes);
    router.get("/type/:type", categories.findAllByType);


    /**
     *  TESTING ROUES
     */
    router.post("/generate_sample_data", categories.generate_sample_data)
    router.post("/generate_cool_data", categories.generate_cool_data)
    router.post("/", categories.create);
    router.get("/", categories.findAll);
    router.get("/title/:title", categories.findOneByTitle);
    router.get("/type/:type", categories.findAllByType);
    router.put("/title/:title", categories.updateByTitle);
    router.delete("/title/:title", categories.deleteByTitle);
    router.delete("/", categories.deleteAll);

    app.use("/api/categories", router);
};
