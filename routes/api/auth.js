const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   Get api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', '유효한 이메일을 포함해주세요').isEmail(),
    check('password', '비밀번호를 입력해주세요.').exists(),
  ],
  async (req, res) => {
    // validationResult: 유효성 검사 결과
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // 사용자가 존재하는지 확인
      let user = await User.findOne({
        email,
      });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] });
      }

      // jsonwebtoken 반환
      const payload = {
        user: {
          id: user.id,
        },
      };
      // https://velopert.com/2389 참고
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // 포스트맨으로 확인시 token:블라블라...이렇게 토큰이 발급되있음
        }
      );

      //   res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
