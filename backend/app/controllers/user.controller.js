const db = require("../models");
const jwt= require("jsonwebtoken");
const User = db.users;
const Op = db.Sequelize.Op;
const UserNoteRelationship = db.userNoteRelationShip;
const Note = db.notes;
const bcrypt = require('bcrypt');
const saltRounds = 10; // This defines the number of salt rounds
const salt = saltRounds;

require('dotenv').config();

function authToken(req, res) {
  const token = req.body.accessToken;

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err,) => {
    if(err) {
      res.sendStatus(403);
      return false;
    }
    return true;
  })
}

function generateJWT(email) {
  return jwt.sign({'email': email}, process.env.SECRET_ACCESS_TOKEN);
}

/*
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token,
      'secret',
      (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        req.userId = decoded.id;
        next();
      });
};
*/

/**
 * USED ROUTES
 */

exports.shareNote = async (req, res) => {
  console.log("Executing share note");
    try {
      //verify if access is allowed
      console.log("checking access token...");
      const token = req.body.accessToken;
      console.log(token);
      console.log('f');
      if (!token) {
        console.log("No token provided for share note.")
        res.sendStatus(403);
        return;
      }
      if (token) {
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
          if (err) {
            console.log("Unable to verify token: unauthorized to access share note");
            res.sendStatus(403);
          } else {
            console.log("Authorization to share note granted");
          }

        });}
      const username = req.body.username;
      const title = req.body.title;

      //Check if the user exists
      const user = await User.findOne({where: {username: username}});
      if (!user) {
        console.log("The user does not exists.");
        res.status(500).send("User does not exits(cannot share)")
        return;
      }

      const user_note_relationship = {
        'username': username,
        'title': title,
        'isShared': true
      }

      await UserNoteRelationship.create(user_note_relationship);
      console.log("create user_note_relationship");
      res.status(200).send("created user_note_relationship");

    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
}

exports.checkLogin = async (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  let email = req.body.email;
  let password = req.body.password;


  const user = await User.findOne({where: {'email': email}});

  if (!user) {
    res.status(401).send("incorrect email");
    return;
  }
  let passwordMatches = await bcrypt.compare(password, user.password);
  if (passwordMatches) {
    console.log("Password matches hashed password.");
  } else {
    console.log("Password does not match the hashed password.");
    res.status(401).send({message: "Incorrect password."});
    return;
  }

  User.findOne({where: {email: email}})
      .then(data => {

        if (!data) {
          res.status(401).send("incorrect email");
        } else if (data.email === email && passwordMatches) {
          const token = generateJWT(email);
          /*const token = jwt.sign({ email: data.email },
              'secret',
              {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
              }); */
          res.send({
            username: data.username,
            email: data.email,
            password: data.password,
            avatar: data.avatar,
            accessToken: token
          });
        } else {
          res.status(401).send({
            message: 'incorrect password'
          });
        }
        //<Access token is unauthorized needs to be implemented>
      }).catch(err => {
    console.log(err);
    res.status(500).send({
      message: 'Server Error ' + err
    });
  });

};


async function doesUserExist(attribute, field) {
  try {
    const user = await User.findOne({ where: { [field]: attribute } });
    return !!user; // Convert user to a boolean value (true if user exists, false if not)
  } catch (error) {
    console.error('Error occurred:', error);
    return false; // Return false in case of an error
  }
}

// Do sign up
exports.doSignup = async (req, res) => {

  console.log("Executing signup...");

  try {

    // Validate request
    if (!req.body.email || !req.body.password || !req.body.username) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    let email = req.body.email;
    let password = req.body.password;

    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, salt);
    // Store the username and hashed password in your database
    // ... (your database logic here)

    let username = req.body.username;
    let avatar = req.body.avatar;

    if (!avatar) {
      avatar = 'default.png';
    }

    //check if username or email is already taken
    let checkA = await doesUserExist(username, 'username');
    let checkB = await doesUserExist(email, 'email');

    if (checkA || checkB) {
      res.status(401).send("Email or Username already taken");
      return;

    }

    // Create a User
    const user = {
      username: username,
      password: hashedPassword,
      email: email,
      avatar: avatar
    };

    // Create the user first
    const user_data = await User.create(user);
    res.send(user_data);

  } catch (error) {
    console.log("Signup failed.")
    console.log(error);
  }

};

exports.resetPassword = async (req, res) => {
  console.log("reset password called");
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send("No content provided!");
      return;
    }
    let email = req.body.email;
    let password = req.body.password;
    const user = await User.findOne({ where: {email: email} });

    if (!user) {
      res.status(400).send("User not found!");
      return;
    }

    // Update the user's password
    //WE NEED TO HASH THIS PASSWORD LIKE IN SIGNUP

    console.log("hashing in reset password: " + password);
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.send("User password updated successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error when trying to update the user password");
  }
}

//EDIT PROFILE IS A RESTRICTED API ENDPOINT NEEDS TO BE VERIFIED BY THE ACCESS TOKEN
exports.editProfile = async (req, res) => {

  console.log("Edit Profile called");
  try {
    //verify if access is allowed
    console.log("checking access token...");
    const token = req.body.accessToken;
    console.log(token);
    console.log('f');
    if (!token) {
      console.log("No token provided for edit profile.")
      res.sendStatus(403);
      return;
    }
    if (token) {
      jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
        if (err) {
          console.log("Unable to verify token: unauthorized to access edit profile");
          res.sendStatus(403);
        } else {
          console.log("Authorization to edit profile granted");
        }

      });}
    if (!req.body.email || !req.body.password) {
      res.status(400).send("No content provided!");
      return;
    }
    let email = req.body.email;
    let password = req.body.password;

    //WE NEED TO HASH THIS PASSWORD LIKE IN SIGNUP

    console.log("hashing in edit profile: " + password);
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store the username and hashed password in your database
    // ... (your database logic here)

    let avatar = "default.png";
    if (req.body.avatar) {
      avatar = req.body.avatar
    }
    const user = await User.findOne({ where: {username: req.body.username} });
    console.log(user);

    if (!user) {
      res.status(400).send("User not found!");
      return;
    }

    // Update the user's details
    user.email = email;
    user.password = hashedPassword;
    user.avatar = avatar;

    // Save the updated user
    await user.save();

    console.log("updated: " + user);
    res.send({
      username: user.username,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
      accessToken: token
    });

  }
  catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error when trying to update user details");
  }
}

//DELETE PROFILE IS A RESTRICTED API ENDPOINT NEEDS TO BE VERIFIED BY THE ACCESS TOKEN
exports.deleteProfile = async (req, res) => {
  try {
    const token = req.body.accessToken;
    console.log(token);
    console.log('f');
    if (!token) {
      console.log("Not token provided for delete profile.")
      res.sendStatus(403);
      return;
    }
    if (token) {
      jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, ) => {
        if (err) {
          console.log("Unable to verify token: unauthorized to access delete profile");
          res.sendStatus(403);
        } else {
          console.log("Authorization to delete profile granted");
        }

      });}
    if (!req.body.username) {
      console.log("username empty: " + JSON.stringify(req.body));
      res.status(400).send({message: "Attributes cannot be empty!"});
      return;
    }
    let username = req.body.username;
    const user = await User.findOne({ where: {username: username} });
    if (!user) {
      console.log("user note found")
      res.status(400).send("User not found!");
      return;
    }

    // delete all owned notes before deleting the users
    const user_note_relationships = await UserNoteRelationship.findAll({where: {username: username, isShared: false}});
    console.log(user_note_relationships)
    let rel;
    // first delete all user's owned notes
    user_note_relationships.forEach(async (rel) => {
      console.log(rel);
      let title = rel.dataValues.title;
      const note = await Note.findOne({where: {title: title}});
      await note.destroy().catch(err => {console.log("failed to destroy owned note " + note + " " + err)});
    });
    // then delete all associated relationships
    user_note_relationships.forEach(async (rel) => {
      await rel.destroy().catch(err => {console.log("failed to destroy rel " + rel + " " + err)});
    });

    // finally destroy the user
    await user.destroy();

    res.send("User successfully deleted.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error when trying to delete the user.");
  }
};


/**
 * HELPER FUNCTIONS
 */


/**
 * TESTING ROUTES
 */

//Create sample users into the database
exports.generate_sample_data = async (req, res) => {
  for (let count = 0; count < 100; count++) {

    //WE HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash('password' + count, salt);
    // Store the username and hashed password in your database
    // ... (your database logic here)


    // Create a User
    const user = {
      username: 'user' + count,
      password: hashedPassword,
      email: 'user' + count + '@gmail.com',
      avatar: 'default.png'
    };

    // Save User in the database
    User.create(user)
        .catch(err => {
          // Handle errors, including foreign key constraint violations
          if (err.name === 'SequelizeForeignKeyConstraintError') {
            console.error('Foreign key constraint violation:', err.message);
          } else {
            console.error('Error while creating the User:', err);
          }
        });
  }
  res.send("");
}

//Create sample users into the database
exports.generate_cool_data = async (req, res) => {
  for (let count = 0; count < 10; count++) {

    //WE HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash('password' + count, salt);
    // Store the username and hashed password in your database
    // ... (your database logic here)

    // Create a User
    const user = {
      username: 'user' + count,
      password: 'password' + count,
      email: 'user' + count + '@gmail.com',
      avatar: 'default.png'
    };

    // Save User in the database
    User.create(user)
        .catch(err => {
          // Handle errors, including foreign key constraint violations
          if (err.name === 'SequelizeForeignKeyConstraintError') {
            console.error('Foreign key constraint violation:', err.message);
          } else {
            console.error('Error while creating the User:', err);
          }
        });
  }
  res.send("");
}

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  //WE HASH THE PASSWORD
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // Store the username and hashed password in your database
  // ... (your database logic here)

  // Create a User
  const user = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    avatar: req.body.avatar
  };

  // Save User in the database
  User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while creating the User."
        });
      });
};

// Retrieve all Users from the database.
// Use the query parameter when we want query users with similar names or similar emails together
exports.findAll = (req, res) => {
  const username = req.query.username;
  const email = req.query.email;
  let condition = username ? {username: {[Op.iLike]: `%${username}%`}} : null;
  if (email != null) {
    if (name != null) {
      condition = name ? {username: {[Op.iLike]: `%${username}%`}, email: {[Op.iLike]: `%${email}%`}} : null;
    } else {
      condition = name ? {email: {[Op.iLike]: `%${email}%`}} : null;
    }
  }

  User.findAll({ where: condition })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Finds a single user matching the specified name
exports.findOneByName = (req, res) => {
  const username = req.params.username;
  const condition = username ? {username: {[Op.iLike]: `${username}`}} : null;
  User.findOne({where: condition})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with name=" + username + " " + err
        });
      });
}


// Finds a single user matching the specified email
exports.findOneByEmail = (req, res) => {
  const email = req.params.email;
  const condition = email ? {email: {[Op.iLike]: `${email}`}} : null;
  User.findOne({where: condition})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with email=" + email + " " + err
        });
      });
}

// Update a User by Username
exports.updateByUsername = (req, res) => {
  const username = req.params.username;

  User.update(req.body, {
    where: { username: username }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with username=" + username + " " + err
      });
    });
};

// Update a User by Email
exports.updateByEmail = (req, res) => {
  const email = req.params.email;

  User.update(req.body, {
    where: { email: email }
  })
      .then(num => {
        if (num === 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with email=${email}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with email=" + email + " " + err
        });
      });
};

// Delete a User with the specified id in the request
exports.deleteByUsername = (req, res) => {
  const username = req.params.username;

  User.destroy({
    where: { username: username }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with username=${username}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with username=" + username + " " + err.message
      });
    });
};

// Delete a User with the specified email in the request
exports.deleteByEmail = (req, res) => {
  const email = req.params.email;

  User.destroy({
    where: { email: email }
  })
      .then(num => {
        if (num === 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with email=${email}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with email=" + email + " " + err
        });
      });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};
