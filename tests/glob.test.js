const { removeDuplicates, matchesFiles, ingoreFiles, hasMatches  } = require('../src/glob.js');

describe("Glob", () => {
  test("it should remove duplicates string from an array", async () => {
    const arrayWithDuplicates = ['horse', 'dog', 'cat', 'Cat', 'dog'];
    const arrayWithoutDuplicates = ['horse', 'cat', 'Cat', 'dog'];

    expect(removeDuplicates(arrayWithDuplicates).sort()).toEqual(arrayWithoutDuplicates.sort());
  });

  test("it should remove duplicates string from an array", async () => {
    const files = ['test/test.md', 'test/zug/README.md', 'README.md', 'animal/Cat.png', 'animal/dog.png'];

    const withMarkdown = ['test/test.md', 'test/zug/README.md', 'README.md'];
    expect(matchesFiles(files, ['**/*.md']).sort()).toEqual(withMarkdown.sort());

    const withBaseMarkdown = ['README.md'];
    expect(matchesFiles(files, ['*.md']).sort()).toEqual(withBaseMarkdown.sort());

    const withBaseReadme = ['README.md'];
    expect(matchesFiles(files, ['README.md']).sort()).toEqual(withBaseReadme.sort());

    const withReadmes = ['test/zug/README.md', 'README.md'];
    expect(matchesFiles(files, ['**/README.md']).sort()).toEqual(withReadmes.sort());

    const withAnimals = ['animal/Cat.png', 'animal/dog.png'];
    expect(matchesFiles(files, ['animal/*']).sort()).toEqual(withAnimals.sort());
  });

  test("it should test if function removes ingnored files", async () => {
    const files = ['test/test.md', 'test/zug/README.md', 'README.md', 'animal/Cat.png', 'animal/dog.png'];

    const withoutMarkdown = ['animal/Cat.png', 'animal/dog.png'];
    expect(ingoreFiles(files, ['**/*.md']).sort()).toEqual(withoutMarkdown.sort());

    const withoutBaseMarkdown = ['test/test.md', 'test/zug/README.md', 'animal/Cat.png', 'animal/dog.png'];
    expect(ingoreFiles(files, ['*.md']).sort()).toEqual(withoutBaseMarkdown.sort());

    const withoutBaseReadme = ['test/test.md', 'test/zug/README.md', 'animal/Cat.png', 'animal/dog.png'];
    expect(ingoreFiles(files, ['README.md']).sort()).toEqual(withoutBaseReadme.sort());

    const withoutReadmes = ['test/test.md', 'animal/Cat.png', 'animal/dog.png'];
    expect(ingoreFiles(files, ['**/README.md']).sort()).toEqual(withoutReadmes.sort());

    const withoutAnimals = ['test/test.md', 'test/zug/README.md', 'README.md'];
    expect(ingoreFiles(files, ['animal/*']).sort()).toEqual(withoutAnimals.sort());
  });

  test("it should check if array has matches or not", async () => {
    expect(hasMatches(['horse', 'dog'])).toEqual(true);

    expect(hasMatches([])).toEqual(false);
  });
});
