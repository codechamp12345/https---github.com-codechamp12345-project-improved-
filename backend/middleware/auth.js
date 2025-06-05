import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route (no token)'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if role is present
      const role = decoded.role;

      if (role === 'admin') {
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin) {
          return res.status(401).json({
            success: false,
            message: 'Admin not found'
          });
        }
        
        req.user = admin;
        req.user.role = 'admin';
      } else {
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
          });
        }
        
        req.user = user;
        req.user.role = role || 'user';
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route (invalid token)'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error in authentication'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure user object and role are available after protect middleware
    if (!req.user || !req.user._id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required for authorization'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    
    next();
  };
};
