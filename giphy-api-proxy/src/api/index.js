const express = require('express');

const search = require('./giphy-search');
const trending = require('./giphy-trending');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Giphy API proxy',
  });
});

router.use('/giphy-search', search);
router.use('/giphy-trending', trending);

module.exports = router;
