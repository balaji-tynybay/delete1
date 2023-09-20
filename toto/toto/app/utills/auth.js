const jwt = require('jsonwebtoken');

class VerifyService {
  static verifyToken(token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Replace with your actual secret key
      return decodedToken;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
}

module.exports = VerifyService;
