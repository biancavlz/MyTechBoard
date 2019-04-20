const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/news', (req, res, next) => {
  res.render('news');
});

module.exports = router;