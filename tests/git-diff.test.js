const { getGitDiffFiles } = require('../src/git-diff.js');

describe("Git diff", () => {
  test("it should list changed files", async () => {
    const changedFiles = await getGitDiffFiles();

    expect(changedFiles.length).toEqual(2);
  });
});
