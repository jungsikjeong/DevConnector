const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

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
  (req, res) => {
    // validationResult: 유효성 검사 결과
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    res.send('User route');
  }
);

module.exports = router;
