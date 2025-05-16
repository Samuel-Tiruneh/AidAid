// // // authMiddleware.js
// // const jwt = require('jsonwebtoken');

// // const authenticateUser = (req, res, next) => {
// //   try {
// //     // 1. Get token from header
// //     const token = req.header('Authorization')?.replace('Bearer ', '');
    
// //     if (!token) {
// //       return res.status(401).json({ message: 'No token, authorization denied' });
// //     }

// //     // 2. Verify token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// //     // 3. Attach user to request
// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     console.error('Authentication error:', error);
// //     res.status(401).json({ message: 'Token is not valid' });
// //   }
// // };

// // const cors = require("cors");
// // app.use(cors({
// //   origin: "http://localhost:5173", // Update with your frontend URL
// //   credentials: true,
// // }));

// // module.exports = { authenticateUser };


// const jwt = require('jsonwebtoken');

// const authenticateUser = (req, res, next) => {
//   try {
//     // 1. Get token from header
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     // 2. Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // 3. Attach user to request
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = { authenticateUser };


const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { authenticateUser };