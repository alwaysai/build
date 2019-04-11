import { GitInfoFile } from './git-info-file';
import * as tempy from 'tempy';
import { createGit } from './create-git';
import { writeFileSync } from 'fs';
import { join } from 'path';

const dir = tempy.directory();
const git = createGit(dir);

git('init');
writeFileSync(join(dir, 'foo.bar'), 'something');
git('add', dir);
git('commit', '-a', '-m', 'initial commit');
writeFileSync(join(dir, 'bar.foo'), 'blah blah blah');

const subject = GitInfoFile(dir);

describe(GitInfoFile.name, () => {
  it('Writes git information to the specified directory', () => {
    const comment = 'A comment';
    subject.write(comment);
    const info = subject.read();
    const commitHash = git('rev-parse', 'HEAD');
    const expectedInfo: typeof info = {
      comment,
      commitHash,
      diff: `diff --git a/bar.foo b/bar.foo
new file mode 100644
index 0000000..f0c1bd0
--- /dev/null
+++ b/bar.foo
@@ -0,0 +1 @@
+blah blah blah
\\ No newline at end of file`,
      directory: dir,
    };
    expect(info).toEqual(expectedInfo);
  });
});
