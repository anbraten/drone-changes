const minimatch = require('minimatch');

function removeDuplicates(array) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

function matchesFiles(files, includes) {
  if (Array.isArray(includes)) {
    return includes.reduce((matches, include) => removeDuplicates([...matches, ...matchesFiles(files, include)]), []);
  }

  const match = minimatch.match(files, includes, { matchBase: false });
  return match;
}

function ingoreFiles(files, _ignored) {
  const ignored = _ignored.map(i => `!${i}`);
  return matchesFiles(files, ignored);
}

function hasMatches(matches) {
  return !!matches.length;
}

module.exports = {
  removeDuplicates,
  matchesFiles,
  ingoreFiles,
  hasMatches,
};
