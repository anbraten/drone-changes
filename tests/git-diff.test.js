const { getGitDiffFiles } = require('../src/git-diff.js');

const changedFiles = ['test/docs.md', 'README.md'];

jest.mock('../src/shell.js', () => ({
  run: () => 'test/docs.md\nREADME.md',
}));

describe('Git diff', () => {
  test('it should list changed files', async () => {
    const gitDiffFiles = await getGitDiffFiles();

    expect(gitDiffFiles.sort()).toEqual(changedFiles.sort());
  });
});
