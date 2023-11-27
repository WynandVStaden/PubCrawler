const db = require("../models");
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const Note = db.notes;
const UserNoteRelationship = db.userNoteRelationShip;
const Op = db.Sequelize.Op;
require('dotenv').config();
const {createStatsArrays} = require("../sample_functions/attributes");
const {createEnemiesArrays} = require("../sample_functions/enemies");
const {createCharactersArrays} = require("../sample_functions/heroes");
const {createPointsOfInterestArrays} = require("../sample_functions/locations");
const {createLootArrays} = require("../sample_functions/loot");
const {getNotesOfType_f} = require("./category.controller");

function authToken(req, res) {
    const token = req.body.accessToken;

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if(err) {
            res.sendStatus(403);
            return false;
        };
        return true;
    })
}

function generateJWT(email) {
    return jwt.sign(email, process.env.SECRET_ACCESS_TOKEN);
}


/**
 * ROUTES WE USE
 */

//FILTER NOTES BY CATEGORY TYPE
exports.getAllNotesOfType = async (req, res) => {

    console.log("executing getAllNotesOfType");
    try {

        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;

        if (!token) {
            console.log("No token provided for get all notes  of type.")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: unauthorized to use get notes of type");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization to use get notes of type granted");
                }

            });}

        const categoriesOfType = await getNotesOfType_f(req.body.type);
        const allNotes = await Note.findAll();
        var arrNotesOfType = [];
        var count = 0;
        for (const [index, c] of categoriesOfType.entries()) {
            for (const [index, n] of allNotes.entries()) {
                if (c.title === n.title) {
                    arrNotesOfType[count] = n;
                    count++;
                }
            }
        }
        console.log("notes of type: " + req.body.type);
        console.log(arrNotesOfType)
        res.send(arrNotesOfType);
    } catch(e) {
        console.log(e);
    }
};

//FILTER NOTES BY DATE EDITED
exports.sortNotesByDateEdited = async (req, res) => {
    console.log("executing sortNotesByDateEdited");
    try {

        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;
        console.log(token);
        console.log('f');
        if (!token) {
            console.log("No token provided for notes by date edited.")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: unauthorized to use notes by date edited");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization to use notes by date edited");
                }

            });}

        var sortNotes = req.body.notes;
        var filter = req.body.filter;
        if (filter === "oldest") {
            sortNotes.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        } else {
            sortNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        res.send(sortNotes);
    } catch (error) {
        console.log(error);
    }
}

exports.queryByTitle = async (req, res) => {
    console.log("Egg zer cute ing queryByTitle...")
    try {
        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;
        console.log(token);
        console.log('f');
        if (!token) {
            console.log("No token provided to use query by title.")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: unauthorized to use query by title");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization to query by title granted");
                }

            });}

        const title = req.body.title;
        console.log('title: ' + title);
        const condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;
        const queriedNotes = await Note.findAll({where: condition});
        console.log(queriedNotes);
        res.send(queriedNotes);
    } catch(e) {
        res.status(500).send(e);
        console.log(e);
    }
}

exports.isOwnedOrShared = async (req, res) => {
    console.log("Egg zer cute ing isOwnedOrShared...");
    try {

        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;
        console.log(token);
        console.log('f');
        if (!token) {
            console.log("No token provided to use is owned or shared.")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: cant use is owned or shared");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization to use is owned or shared granted.");
                }

            });}

        const username = req.body.username;
        const title = req.body.title;

        if (!username || !title) {
            res.status(400).send("Username and title cannot be empty");
            return;
        }

        const user_note_rel =
            await UserNoteRelationship.findOne({where: {username: username, title: title}});
        if (user_note_rel) {
            console.log(user_note_rel);
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch(error) {
        console.log(error);
    }
}

exports.sharedNotes = async (req, res) => {
    console.log("Executing owned notes...");
    try {

        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;
        console.log(token);
        console.log('f');
        if (!token) {
            console.log("No token provided to use shared notes")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: unauthorized to use shared notes");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization to use shared notes");
                }

            });}

        // first we find all user_note_relationships with owned
        const username = req.body.username;
        const user_note_rels =
            await UserNoteRelationship.findAll({where: {isShared: true, username: username}});
        const all_notes = await Note.findAll();
        var all_shared_notes = [];
        var count = 0;

        for (const [index, r] of user_note_rels.entries()) {
            for (const [index, n] of all_notes.entries()) {
                if (r.title === n.title) {
                    all_shared_notes[count] = n;
                    count++;
                }
            }
        }
        res.send(all_shared_notes);

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

exports.ownedNotes = async (req, res) => {

    console.log("Executing owned notes...");
    try {

        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;
        console.log(token);
        console.log('f');
        if (!token) {
            console.log("No token provided to use get owned notes.")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: get owned notes");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization granted to use get owned notes");
                }

            });}

        // first we find all user_note_relationships with owned
        const username = req.body.username;
        const user_note_rels =
            await UserNoteRelationship.findAll({where: {isShared: false, username: username}});
        console.log("user note rels:");
        console.log(user_note_rels);
        const all_notes = await Note.findAll();
        var all_owned_notes = [];
        var count = 0;

        for (const [index, r] of user_note_rels.entries()) {
            for (const [index, n] of all_notes.entries()) {
                if (r.title === n.title) {
                    all_owned_notes[count] = n;
                    count++;
                }
            }
        }
        res.send(all_owned_notes);

    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

//Need to provide username as well to create the note-user relationship
exports.createNote = async (req, res) => {

    console.log("Executing create note.");

    try {

        if (!req.body.username || !req.body.title || !req.body.content) {
            res.status(400).send({message: "Attributes cannot be empty!"});
            return;
        }

        /*Check if the note already exists*/
        let exists = await doesNoteExist(req.body.title, 'title');
        if (exists) {
            res.status(401).send("Note with the same title already exists.");
            return;
        }

        const note = {
            title: req.body.title,
            content: req.body.content
        };

        const user_note_relationship = {
            title: req.body.title,
            username: req.body.username,
            isShared: false
        }


        const created_note = await Note.create(note);
        await UserNoteRelationship.create(user_note_relationship);
        res.status(200).send(created_note);

    } catch (e) {
        console.log(e);
    }
};

exports.editNote = async (req, res) => {
    try {

        //verify if access is allowed
        console.log("checking access token...");
        const token = req.body.accessToken;
        console.log(token);
        console.log('f');
        if (!token) {
            console.log("No token provided to use edit notes.")
            res.sendStatus(403);
            return;
        }
        if (token) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
                if (err) {
                    console.log("Unable to verify token: cant use edit note");
                    res.sendStatus(403);
                } else {
                    console.log("Authorization granted to use edit note");
                }

            });}

        if (!req.body.title || !req.body.content) {
            res.status(400).send({message: "Attributes cannot be empty!"});
            return;
        }
        let title = req.body.title;
        let content = req.body.content;
        const note = await Note.findOne({ where: {"title": title} });


        if (!note) {
            res.status(400).send("Note not found!");
            return;
        }

        // Update the note's content
        note.content = content;

        // Save the note
        await note.save();

        res.send("Note details updated successfully");
    } catch (error) {
        res.status(500).send("Internal Server Error when trying to update the note");
    }

};

exports.deleteNote = async (req, res) => {
    console.log("Executing delete note...")
    try {
        if (!req.body.title) {
            res.status(400).send({message: "Attributes cannot be empty!"});
            return;
        }
        let title = req.body.title;
        const note = await Note.findOne({ where: {"title": title} });
        if (!note) {
            res.status(400).send("Note not found!");
            return;
        }
        console.log("attempting to delete note...");
        await note.delete();
        res.send("Note successfully deleted.");

        //WE NEED TO DELETE THE USER NOTE RELATIONSHIP HERE OR SET DELETE TO CASCADE


    } catch (error) {
        res.status(500).send("Internal Server Error when trying to delete the note.");
    }
};


exports.getAllNotes = (req, res) => {

    const token = req.body.accessToken;
    console.log(token);
    console.log('f');
    if (token) {
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
            if (err) {
                console.log("Unable to verify token: unauthorized to use get all notes");
                res.sendStatus(403);
            } else {
                console.log("Authorization to get all notes granted");
            }

        });}
    const title = req.body.title;
    let condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;

    Note.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Notes."
            });
        });
};

/**
 * HELPER FUNCTIONS
 */
async function doesNoteExist(attribute, field) {
    try {
        const note = await Note.findOne({ where: { [field]: attribute } });
        return !!note; // Convert user to a boolean value (true if user exists, false if not)
    } catch (error) {
        console.error('Error occurred:', error);
        return false; // Return false in case of an error
    }
}

/**
 * TESTING ROUTES BEYOND THIS LINE (NO REAL USAGE)
 */

//Create sample Notes into the database
exports.generate_sample_data = async (req, res) => {

    try {

        for (let count = 0; count < 100; count++) {

            // Create a Note
            const note = {
                title: 'title' + count,
                content: 'content' + count,
                categoryID: count + 1
            };

            // Save Note in the database


            await Note.create(note)
                .catch(err => {
                    // Handle errors, including foreign key constraint violations
                    if (err.name === 'SequelizeForeignKeyConstraintError') {
                        console.error('Foreign key constraint violation:', err.message);
                    } else {
                        console.error('Error while creating the Note:', err);
                    }
                });

        }
        res.send("");

    } catch(e) {
        console.log(e);
    }
}

exports.generate_sample_data2 = async (req, res) => {

    try {

        for (let count = 0; count < 100; count++) {
            const user_note_relationship = {
                title: 'title' + count,
                username: 'user' + count,
                isShared: false
            }
            // Create the user-note relationship entry
            await UserNoteRelationship.create(user_note_relationship);

        }
        res.send("");
    } catch(e) {
        console.log(e);
    }
}

//Create sample Notes into the database
exports.generate_cool_data = async (req, res) => {

    try {

        const {stats: statNames, descriptions: statDescriptions} = createStatsArrays();
        const {names: enemyNames, descriptions: enemyDescriptions} = createEnemiesArrays();
        const {names: characterNames, descriptions: characterDescriptions} = createCharactersArrays();
        const {types: lootNames, descriptions: lootDescriptions} = createLootArrays();
        const {names: locationNames, descriptions: locationDescriptions} = createPointsOfInterestArrays();


        for (let count = 0; count < 10; count++) {

            // Create a Note
            const noteStat = {
                title: statNames[count],
                content: statDescriptions[count]
            };
            const enemyNote = {
                title: enemyNames[count],
                content: enemyDescriptions[count]
            };
            const characterNote = {
                title: characterNames[count],
                content: characterDescriptions[count]
            };
            const lootNote = {
                title: lootNames[count],
                content: lootDescriptions[count]
            };
            const locationNote = {
                title: locationNames[count],
                content: locationDescriptions[count]
            };

            // Save Note in the database
            await Note.create(noteStat);
            await Note.create(enemyNote);
            await Note.create(characterNote);
            await Note.create(lootNote);
            await Note.create(locationNote);

        }
        res.send("");

    } catch(e) {
        console.log(e);
    }
}

exports.generate_cool_data2 = async (req, res) => {

    try {

        const {stats: statNames, descriptions: statDescriptions} = createStatsArrays();
        const {names: enemyNames, descriptions: enemyDescriptions} = createEnemiesArrays();
        const {names: characterNames, descriptions: characterDescriptions} = createCharactersArrays();
        const {types: lootNames, descriptions: lootDescriptions} = createLootArrays();
        const {names: locationNames, descriptions: locationDescriptions} = createPointsOfInterestArrays();


        for (let count = 0; count < 10; count++) {
            const stat_user_note_relationship = {
                title: statNames[count],
                username: 'user' + count,
                isShared: false
            }
            const enemy_user_note_relationship = {
                title: enemyNames[count],
                username: 'user' + count,
                isShared: false
            }
            const character_user_note_relationship = {
                title: characterNames[count],
                username: 'user' + count,
                isShared: false
            }
            const loot_user_note_relationship = {
                title: lootNames[count],
                username: 'user' + count,
                isShared: false
            }
            const location_user_note_relationship = {
                title: locationNames[count],
                username: 'user' + count,
                isShared: false
            }
            // Create the user-note relationship entry
            await UserNoteRelationship.create(stat_user_note_relationship);
            await UserNoteRelationship.create(enemy_user_note_relationship);
            await UserNoteRelationship.create(character_user_note_relationship);
            await UserNoteRelationship.create(loot_user_note_relationship);
            await UserNoteRelationship.create(location_user_note_relationship);


        }
        res.send("");

    } catch (e) {
        console.log(e);
    }
}



/**
 * const user_note_relationship = {
 *             title: 'title' + count,
 *             username: 'user' + count
 *         }
 *
 *         // Create the user-note relationship entry
 *         await UserNoteRelationship.create(user_note_relationship);
 */

// Finds a single Note matching the specified name
exports.findOneByUserName = (req, res) => {
    const username = req.params.username;
    const condition = username ? {username: {[Op.iLike]: `${username}`}} : null;
    Note.findOne({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Note with name=" + username + " " + err
            });
        });
}

// Finds a single Note matching the specified title
exports.findOneByTitle = (req, res) => {
    const title = req.params.title;
    Note.findOne({where: {title: title}})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Note with title=" + title + " " + err
            });
        });
}

//Update a note by username
exports.updateByUsername = (req, res) => {
    const username = req.params.username;

    Note.update(req.body, {
        where: {username: username}
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Note was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Note with username=${username}. Maybe Note was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Note with username=" + username + " " + err
            });
        });
};

//Update a note by  title
exports.updateByTitle = (req, res) => {
    const title = req.params.title;

    Note.update(req.body, {
        where: {title: title}
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Note was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Note with title=${title}. Maybe Note was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Note with title=" + title + " " + err
            });
        });
};


// Delete a note by a certain username
exports.deleteByUsername = (req, res) => {
    const username = req.params.username;

    Note.destroy({
        where: {username: username}
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "note was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete note with username=${username}. Maybe note was not found!`
                });
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({
                message: "Could not delete note with username=" + username + " " + err.message
            });
        });
};


//Delete relationship
exports.deleteRelationship = async (req, res) => {

    console.log("Executing delete relationship...");
    try {

        const title = req.params.title;
        const username = req.params.username;

        const user_note_relationship =
            await UserNoteRelationship.findOne({where: {title: title, username: username}});
        await user_note_relationship.destroy();
        res.status(200).send("Deleted user_note_relationship.");

    } catch(e) {

        res.status(500).send("Note destroyed.");

    }

};

// Delete a note by a certain title
exports.deleteByTitle = (req, res) => {
    const title = req.params.title;

    Note.destroy({
        where: {title: title}
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "note was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete note with title=${title}. Maybe note was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete note with title=" + title + " " + err
            });
        });
};

// Delete all Notes from the database.
exports.deleteAll = (req, res) => {
    Note.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} Notes were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Notes."
            });
        });
};
