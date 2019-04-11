import { execFileSync } from 'child_process';

export function createGit(dir: string) {
  return function git(...args: string[]) {
    try {
      const stdout = execFileSync('git', args, {
        encoding: 'utf8',
        cwd: dir,
      });
      return stdout.replace(/\n$/gm, '');
    } catch (ex) {
      ex.message = ex.message || 'Failed to run "git"';
      if (ex.stdout) {
        ex.message += `\n\nSTDOUT:\n${ex.stdout}`;
      }
      if (ex.stderr) {
        ex.message += `\n\nSTDERR:\n${ex.stderr}`;
      }
      throw ex;
    }
  };
}
