module.exports = function (req, res, next) {
    // Check if user is an employee or manager
    if (req.user.role !== 'employee' && req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Authorization denied' });
    }
    next();
  };
  