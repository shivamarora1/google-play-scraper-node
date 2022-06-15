'use strict';

const url = require('url');
const R = require('ramda');
const scriptData = require('./scriptData');
const { BASE_URL } = require('../constants');

const MAPPINGS = {
  title: [0, 3],
  appId: [0, 0, 0],
  url: {
    path: [0, 8, 6, 5, 2],
    fun: (path) => new url.URL(path, BASE_URL).toString()
  },
  icon: [0, 1, 3, 2],
  developer: [0, 14],
  priceText: {
    path: [0, 8, 1, 0, 2],
    fun: (price) => price === undefined ? 'FREE' : price
  },
  currency: {
    path: [0, 8, 1, 0, 1],
    fun: (price) => price === undefined ? undefined : price.match(/([^0-9.,\s]+)/)[0]
  },
  price: {
    path: [0, 8, 1, 0, 2],
    fun: (price) => price === undefined || price === 0 || price === '' ? 0 : parseFloat(price.match(/([0-9.,]+)/)[0])
  },
  free: {
    path: [0, 8, 1, 0, 2],
    fun: (price) => price === undefined || price === ''
  },
  summary: [0, 13, 1],
  scoreText: [0, 4, 0],
  score: [0, 4, 1]
};

const MAPPINGS_ALT = {
  title: [3],
  appId: [0, 0],
  url: {
    path: [8, 6, 5, 2],
    fun: (path) => new url.URL(path, BASE_URL).toString()
  },
  icon: [1, 3, 2],
  developer: [ 14],
  priceText: {
    path: [8, 1, 0, 2],
    fun: (price) => price === undefined ? 'FREE' : price
  },
  currency: {
    path: [8, 1, 0, 1],
    fun: (price) => price === undefined ? undefined : price.match(/([^0-9.,\s]+)/)[0]
  },
  price: {
    path: [8, 1, 0, 2],
    fun: (price) => price === undefined || price === 0 || price === '' ? 0 : parseFloat(price.match(/([0-9.,]+)/)[0])
  },
  free: {
    path: [8, 1, 0, 2],
    fun: (price) => price === undefined || price === ''
  },
  summary: [13, 1],
  scoreText: [4, 0],
  score: [4, 1]
};

function extaractDeveloperId (link) {
  return link.split('?id=')[1];
}

/*
 * Apply MAPPINGS for each application in list from root path
*/

function extract (root, rootAlt, data) {

  let input = R.path(root, data);
  let mappings = MAPPINGS;
  if (input === undefined) {
    input = R.path(rootAlt, data);
    mappings= MAPPINGS_ALT;
  }
  if (input === undefined) return [];
  
  return R.map(scriptData.extractor(mappings), input);
}

module.exports = { MAPPINGS, extract };
