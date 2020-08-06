const { getGitDiffFiles } = require('./git-diff');
const { ingoreFiles, matchesFiles, hasMatches } = require('./glob');

async function init() {
  const before = process.env.DRONE_COMMIT_BEFORE;
  const after = process.env.DRONE_COMMIT_AFTER;

  let includes = process.env.PLUGIN_INCLUDES;
  if (!includes) {
    throw new Error('Please set "includes" settings for this plugin!');
  }

  if (typeof includes === 'string') {
    includes = includes.split(',').map(i => i.trim());
  }

  let excludes = process.env.PLUGIN_EXCLUDES;
  if (!excludes) {
    throw new Error('Please set "excludes" settings for this plugin!');
  }

  if (typeof excludes === 'string') {

    excludes = excludes.split(',').map(i => i.trim());
  }

  console.log('includes', includes);
  console.log('excludes', excludes);

  const changedFiles = await getGitDiffFiles(before, after);
  console.log('changed files', changedFiles);

  const nonIgnoredChangedFiles = ingoreFiles(changedFiles, excludes);
  console.log('non ignored changed files', nonIgnoredChangedFiles);

  const matches = matchesFiles(nonIgnoredChangedFiles, includes);

  console.log('matches', matches);

  if (!hasMatches(matches)) {
    console.log('no files have changed => skip ci execution');
    process.exit(78);
  } else {
    console.log('files changed => continue ci execution');
    process.exit(0);
  }
}

process.on('uncaughtException', err => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

init();
