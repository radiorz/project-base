const { Release } = require('../dist/index.js');

const release = new Release({});
release.start();

// import config from './release.json'
// const release = new Release(config);
// release.start()
