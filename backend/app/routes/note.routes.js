const notes = require("../controllers/note.controller");
module.exports = app => {
    const notes = require("../controllers/note.controller.js");
    const router = require("express").Router();

    /**
     * USED ROUTES
     */
    router.post("/create_note", notes.createNote);
    router.put("/edit_note", notes.editNote);
    router.post("/query_by_title", notes.queryByTitle);
    router.delete("/delete_note", notes.deleteNote);


    router.post("/is_owned_or_shared", notes.isOwnedOrShared);
    router.delete("/delete_relationship", notes.deleteRelationship);
    router.post("/get_all_notes_of_type", notes.getAllNotesOfType);
    router.post("/sort_notes_by_date_edited", notes.sortNotesByDateEdited);
    router.post("/get_all_owned_notes", notes.ownedNotes);
    router.post("/get_all_shared_notes", notes.sharedNotes);

    /**
     * TESTING ROUTES
     */
    router.get("/get_all_notes", notes.getAllNotes);
    router.post("/generate_sample_data", notes.generate_sample_data);
    router.post("/generate_sample_data2", notes.generate_sample_data2);
    router.post("/generate_cool_data", notes.generate_cool_data);
    router.post("/generate_cool_data2", notes.generate_cool_data2);
    router.get("/title/:title", notes.findOneByTitle);
    router.get("/username/:username", notes.findOneByUserName);
    router.put("/username/:username", notes.updateByUsername);
    router.put("/title/:title", notes.updateByTitle);
    router.delete("/username/:username", notes.deleteByUsername);
    router.delete("/title/:title", notes.deleteByTitle);
    router.delete("/", notes.deleteAll);

    app.use("/api/notes", router);
};
