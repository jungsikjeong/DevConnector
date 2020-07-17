const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   Get api/profile/me
// @desc    현재 사용자 프로필 얻기
// @access  개인 프로필 얻기
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']); // populate: 해당 유저의 이름과 아바타만 보고싶다는 뜻

    if (!profile) {
      return res
        .status(400)
        .json({ message: '이 사용자에 대한 프로필이 없습니다' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
