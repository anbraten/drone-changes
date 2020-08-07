const minimatch = require('minimatch');

function removeDuplicates(array) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

function matchesFiles(files, includes) {
  if (Array.isArray(includes)) {
    return includes.reduce((matches, include) => removeDuplicates([...matches, ...matchesFiles(files, include)]), []);
  }

  return minimatch.match(files, includes, { matchBase: false });
}

function ingoreFiles(files, excludes) {
  if (Array.isArray(excludes)) {
    return excludes.reduce((_files, exclude) => ingoreFiles(_files, exclude), files);
  }

  return minimatch.match(files, `!${excludes}`, { matchBase: false });
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
