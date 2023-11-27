// noinspection JSUnusedLocalSymbols

const db = require("../models");
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const {createStatsArrays} = require("../sample_functions/attributes");
const {createEnemiesArrays} = require("../sample_functions/enemies");
const {createCharactersArrays} = require("../sample_functions/heroes");
const {createPointsOfInterestArrays} = require("../sample_functions/locations");
const {createLootArrays} = require("../sample_functions/loot");
const sequelize = require("sequelize");

const Category = db.categories;
const Op = db.Sequelize.Op;
require('dotenv').config();


function authToken(req, res) {
    const token = req.body.accessToken;

    verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
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
 * USED ROUTES
 */
//CREATE CATEGORY ROUTE
exports.createCategory = async (req, res) => {

    console.log("Egg zer cute ing createCategory...");

    try {

        if (!req.body.title || !req.body.type) {
            res.status(400).send({message: "Attributes cannot be empty!"});
            return;
        }
        let title = req.body.title;
        let type = req.body.type;

        const category = {
            title: title,
            type: type
        };

        Category.create(category).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500)
                .send({message: "Internal Server Error where creating a category. " + err});
        });

    } catch (error) {
        console.log(error);
    }

};

exports.getNotesOfType_f = async (type) => {
    const allCategories = await Category.findAll();
    var arrCategoriesOfType = [];
    var count = 0;
    for (const [index, c] of allCategories.entries()) {
        if (c.type === type) {
            arrCategoriesOfType[count] = c;
            count++;
        }
    }
    return arrCategoriesOfType;
}

exports.getNotesOfType = (req, res) => {
    const type = req.body.type;

    Category.findAll({
        attributes: ['title', 'type'],
        where: {type: type},
        group: ['title', 'type'],})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Notes of type " + type
            });
        });
};

exports.findAllTypes = (req, res) => {
    const type = req.type;

    Category.findAll({ attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('type')), 'type']
        ]})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
};

/**
 * HELPER FUNCTIONS
*/
async function doesCategoryExist(attribute, field) {
    try {
        const category = await Category.findOne({ where: { [field]: attribute } });
        return !!category;
    } catch (error) {
        console.error('Error occurred:', error);
        return false; // Return false in case of an error
    }
}

/**
 * TESTING ROUTES
 */
exports.generate_sample_data = (req, res) => {
    for (let count = 0; count < 100; count++) {

        // Create a category
        const category = {
            title: 'title' + count,
            type: 'type' + count
        };

        // Save category in the database
        Category.create(category)
            .catch(err => {
                // Handle errors, including foreign key constraint violations
                if (err.name === 'SequelizeForeignKeyConstraintError') {
                    console.error('Foreign key constraint violation:', err.message);
                } else {
                    console.error('Error while creating the Category:', err);
                }
            });
    }
    res.send("");
}

exports.generate_cool_data = (req, res) => {
    const { stats: statNames, descriptions: statDescriptions } = createStatsArrays();
    const { names: enemyNames, descriptions: enemyDescriptions } = createEnemiesArrays();
    const { names: characterNames, descriptions: characterDescriptions } = createCharactersArrays();
    const { types: lootNames, descriptions: lootDescriptions } = createLootArrays();
    const { names: locationNames, descriptions: locationDescriptions } = createPointsOfInterestArrays();


    for (let count = 0; count < 10; count++) {

        const statCategory = {
            title: statNames[count],
            type: 'attributes'
        };
        const enemyCategory = {
            title: enemyNames[count],
            type: 'enemies'
        };
        const characterCategory = {
            title: characterNames[count],
            type: 'characters'
        };
        const lootCategory = {
            title: lootNames[count],
            type: 'loot'
        };
        const locationCategory = {
            title: locationNames[count],
            type: 'locations'
        };

        // Save category in the database
        Category.create(statCategory);
        Category.create(enemyCategory);
        Category.create(characterCategory);
        Category.create(lootCategory);
        Category.create(locationCategory);
    }
    res.send("");
}

// Create and Save a new category
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a category
    const category = {
        title: req.body.title,
        type: req.body.type
    };

    // Save category in the database
    Category.create(category)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the category."
            });
        });
};

// Retrieve all categories from the database.
// Use the query parameter when we want query categories with similar titles or similar types together
exports.findAll = (req, res) => {
    const title = req.query.title;
    const type = req.query.type;
    let condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;
    if (type != null) {
        if (title != null) {
            condition = title ? {title: {[Op.iLike]: `%${title}%`}, type: {[Op.iLike]: `%${type}%`}} : null;
        } else {
            condition = title ? {type: {[Op.iLike]: `%${type}%`}} : null;
        }
    }

    Category.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
};

// Finds a single category matching the specified title
exports.findOneByTitle = (req, res) => {
    const title = req.params.title;
    const condition = title ? {title: {[Op.iLike]: `${title}`}} : null;
    Category.findOne({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving category with title=" + title + " " + err
            });
        });
}

// Finds a single category matching the specified type
exports.findAllByType = (req, res) => {
    const type = req.params.type;
    const condition = type ? {type: {[Op.iLike]: `${type}`}} : null;
    Category.findOne({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving notes with category=" + type + " " + err
            });
        });
}

// Update a category by the id in the request
exports.updateByTitle = (req, res) => {
    const title = req.params.title;

    Category.update(req.body, {
        where: { title: title }
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

// Delete a note by a certain title
exports.deleteByTitle = (req, res) => {
    const title = req.params.title;

    Category.destroy({
        where: { title: title }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "category was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete category with title=${title}. Maybe category was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete category with title=" + title + " " + err
            });
        });
};

// Delete all categories from the database.
exports.deleteAll = (req, res) => {
    Category.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} categories were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all categories."
            });
        });
};
