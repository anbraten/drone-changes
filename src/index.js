const { getGitDiffFiles } = require('./git-diff');
const { ingoreFiles, matchesFiles, hasMatches } = require('./glob');

async function init() {
  const event = process.env.DRONE_BUILD_EVENT;

  let before;
  let after;

  switch (event) {
    case 'push':
      before = process.env.DRONE_COMMIT_BEFORE;
      after = process.env.DRONE_COMMIT_AFTER;
    
      if (/^0+$/.test(before)) {
        console.log('new branch => continue ci execution');
        process.exit(0);
      }
      break;
    case 'pull_request':
      before = `refs/remotes/origin/${process.env.DRONE_TARGET_BRANCH}`;
      after = process.env.DRONE_COMMIT;
      break;
    default:
      console.log(`event ${event} not supported => continue ci execution`);
      process.exit(0);
  }

  console.log('event', event);
  console.log('before', before);
  console.log('after', after);

  let includes = process.env.PLUGIN_INCLUDES || '';
  let excludes = process.env.PLUGIN_EXCLUDES || '';
  if (!includes && !excludes) {
    throw new Error('Please set at least "includes" or "excludes" settings for this plugin!');
  }

  if (typeof includes === 'string') {
    if (includes === '') {
      includes = ['**'];
    } else {
      includes = includes.split(',').map(i => i.trim()).filter(i => !!i);
    }
  }

  if (typeof excludes === 'string') {
    excludes = excludes.split(',').map(i => i.trim()).filter(i => !!i);
  }

  console.log('includes', includes);
  console.log('excludes', excludes);

  const changedFiles = await getGitDiffFiles(before, after);
  console.log('changed files', changedFiles);

  const nonIgnoredChangedFiles = excludes.length ? ingoreFiles(changedFiles, excludes) : changedFiles;
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
