const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: 'My First Post',
      description: 'Random data you shouldnt access if you dont have the token',
    },
    ...req.user,
  });
});

module.exports = router;
