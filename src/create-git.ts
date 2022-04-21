import { execFileSync, SpawnSyncReturns } from 'child_process';

function isSpawnSyncReturns(error: any): error is SpawnSyncReturns<string> {
  return (
    Object.prototype.hasOwnProperty.call(error, 'stderr') ||
    Object.prototype.hasOwnProperty.call(error, 'stdout')
  );
}

export function createGit(dir: string) {
  return function git(...args: string[]) {
    try {
      const stdout = execFileSync('git', args, {
        encoding: 'utf8',
        cwd: dir,
      });
      return stdout.replace(/\n$/gm, '');
    } catch (ex) {
      if (ex instanceof Error && isSpawnSyncReturns(ex)) {
        ex.message = ex.message || 'Failed to run "git"';
        if (ex.stdout) {
          ex.message += `\n\nSTDOUT:\n${ex.stdout}`;
        }
        if (ex.stderr) {
          ex.message += `\n\nSTDERR:\n${ex.stderr}`;
        }
      }
      throw ex;
    }
  };
}
