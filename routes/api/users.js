const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', '이름을 입력하세요').not().isEmpty(),
    check('email', '유효한 이메일을 포함해주세요').isEmail(),
    check('password', '6 자 이상의 비밀번호를 입력해주세요').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // validationResult: 유효성 검사 결과
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      // 사용자가 존재하는지 확인
      let user = await User.findOne({
        email,
      });
      if (user) {
        return re
          .status(400)
          .json({ errors: [{ message: '사용자가 이미 존재합니다' }] });
      }
      // 사용자에게 Gravatar 받기
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // 비밀번호 암호화
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // jsonwebtoken 반환
      res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
