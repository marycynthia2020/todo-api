const { readDatabase, writeDatabse } = require("../utils/dbOps");
const bycrypt = require("bcrypt");

/**
 * register
 * login
 */
async function register(req, res) {
  const { username, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: {
        status: false,
        message: "All fileds are required",
      },
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: {
        status: false,
        message: "Enter a valid email",
      },
    });
  }

  if (username.length < 4 || password.length < 4 || password.includes(" ")) {
    return res.status(400).json({
      error: {
        status: false,
        message:
          "name and password(without space) must be at least 4 characters",
      },
    });
  }

  const db = readDatabase();
  const users = db["users"];
  const existingUser = users.find(
    u => u.email === email || u.username === username
  );

  if (existingUser) {
    return res.status(409).json({
      status: false,
      message: "User already exist",
    });
  }

  const newUser = {
    user_id: db["user_id_autoIncrement"],
    username,
    email,
    password: await bycrypt.hash(password, 10),
  };

  users.push(newUser);
  db.user_id_autoIncrement += 1;
  writeDatabse(db);
  return res.status(201).json({
    success: true,
    message: "User registration succesful",
  });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: {
        status: false,
        message: "All fileds are required",
      },
    });
  }

   if (username.length < 4 || password.length < 4 || password.includes(" ")) {
    return res.status(400).json({
      error: {
        status: false,
        message:
          "name and password(without space) must be at least 4 characters",
      },
    });
  }
  const db = readDatabase()
  const users = db['users']
  const existingUser = users.find(u => u.username === username)

  if(!existingUser){
    return res.status(400).json({
      error: {
        status: false,
        message: 'Invalid usersname'
      },
    });
  }

  const isPasswordMatched = await bycrypt.compare(password, existingUser.password)
  if(!isPasswordMatched){
    return res.status(400).json({
      error: {
        status: false,
        message: 'Invalid credentials'
      },
    });
  }
  const token = btoa(JSON.stringify(req.body))
  return res.status(200).json({
    status: true,
    message: 'Login succesful',
    user: {
        user_id: existingUser.user_id,
        token
    }
  })

}

module.exports = {
  register,
  login,
};
