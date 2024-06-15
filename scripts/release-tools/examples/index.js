const { Release } = require('../dist/index.js');

const release = new Release({
  workspace: '..',
});
release.start();
