const express = require('express');
const axios = require('axios');

const router = express.Router();

const BASE_URL = 'http://api.giphy.com/v1/gifs/trending?';

router.get('/', async (req, res) => {
  try {
    /* eslint-disable no-console */
    console.log(req.query);
    /* eslint-disable no-console */
    const { limit } = req.query;
    const { offset } = req.query;

    const params = new URLSearchParams({
      api_key: process.env.API_KEY,
      limit,
      offset,
    });

    const { data } = await axios.get(`${BASE_URL}${params}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
