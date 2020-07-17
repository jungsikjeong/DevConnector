const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res
      .status(401)
      .json({ message: '토큰이 없으며 승인이 거부되었습니다.' });
  }

  // 토큰 확인
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      message: '토큰이 없습니다.',
    });
  }
};
