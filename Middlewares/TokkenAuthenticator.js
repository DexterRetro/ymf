const jwt = require('jsonwebtoken');


const verifyToken = async(req, res, next) => {
    let token =''
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token= req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(403).json({message:"A token is required for authentication"});
    }
    try {
      const decoded = await jwt.verify(token, process.env.TOKKEN_KEY);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({message:"A token is required for authentication"});
    }
   
  };

module.exports = verifyToken;
