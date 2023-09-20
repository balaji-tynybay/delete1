const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model");

class AuthService {
  static async registerUser(username, password) {
    let checkUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    
    if (!checkUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      return await newUser.save();
    } else {
      throw new Error("User Exist Please login ");
    }
  }

  static async loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return token;
  }
}

module.exports = AuthService;
