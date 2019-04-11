import { existsSync } from 'fs';
import { join } from 'path';

import { ConfigFile } from '@alwaysai/config-nodejs';
import * as t from '@alwaysai/codecs';
import { createGit } from './create-git';

const FILE_NAME = 'alwaysai.git.json';

const codec = t.type({
  directory: t.string,
  commitHash: t.string,
  comment: t.string,
  diff: t.string,
});

const HEAD = 'HEAD';

export function GitInfoFile(dir: string) {
  const git = createGit(dir);

  const configFile = ConfigFile({
    path: join(dir, FILE_NAME),
    codec,
  });

  function write(comment = '') {
    if (!existsSync(join(dir, '.git'))) {
      throw new Error(`"${dir}" is not a git repository`);
    }

    git('add', dir);
    configFile.write({
      directory: dir,
      commitHash: git('rev-parse', HEAD),
      diff: git('diff', HEAD),
      comment,
    });
  }
  return { ...configFile, write };
}
