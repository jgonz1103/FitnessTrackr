/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
    try {
      const {rows: [user]} = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `, [username, password]);
    
      return user
    } catch (error) {
      throw error;
    }
    // const SALT_COUNT = 10;
    // const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
}

async function getUser({ username, password }) {
   try {
    const {rows: [user]} = await client.query(`
    SELECT id 
    FROM users
    VALUES($1, $2)
    ON CONFLICT (user) DO NOTHING
    RETURNING *;
    `, [username, password]);
    return user;
   } catch (error) {
    throw error;
   }
  
   
   
//     const hashedPassword = user.password;
//     // isValid will be a boolean based on wether the password matches the hashed password
//     const isValid = await bcrypt.compare(password, hashedPassword)
}

async function getUserById(userId) {
try {
  const {rows: [user]} = await client.query(`
  SELECT id, username, name FROM users
  WHERE id =${userId}
  `);
  

  return user;
}
catch (error) {
  throw (error)
}
}

async function getUserByUsername(userName) {
try {
  const {rows: [user]} = await client.query(`
  SELECT *
  FROM users
  WHERE username=$1
  `, [userName]);

  return user;
} catch (error) {
  throw error;
}
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}


