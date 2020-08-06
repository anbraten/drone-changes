const { run } = require('./shell');

async function getGitDiffFiles(before, after) {
  let data;

  try {
    data = await run('git', 'diff', '--name-only', before || 'HEAD^', after || 'HEAD');
  } catch (error) {
    console.error('Failed to get git diff!', error);
    return;
  }

  const files = data.split('\n').filter((file) => file.trim() !== '');

  return files;
}

module.exports = {
  getGitDiffFiles,
};
