import inquirer from 'inquirer'
import { platform } from 'node:os'
import { green } from 'picocolors'
import simpleGit, { type SimpleGitOptions, type SimpleGit } from 'simple-git'

const args = require('minimist')(process.argv.slice(2))

const log = (content: string | number | null | undefined) => {
  console.log(green(content))
}

const message: any = log(`
  ✅ 选择要发布的版本号: x.y.z
    -------------------------------
    | x | 破坏性更新，发布主要版本 |
    -------------------------------
    | y | 新增小功能，发布次要版本 |
    -------------------------------
    | z | Bug 修复，发布补丁版本   |
    -------------------------------
`);

const getCwd = () => process.cwd()

const spawn = async (...args: any[]) => {
  const { spawn } = require('child_process')
  return new Promise<void>(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on('close', () => {
      resolve()
    });
  });
};

const command = async (name: string) => {
  const git: SimpleGit = simpleGit({
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 2
  } as Partial<SimpleGitOptions>)
  const currentBranch = (await git.branch()).current
  const npm = platform() === 'win32' ? 'npm.cmd' : 'npm'
  await spawn(npm, ['version', name], { cwd: getCwd() })
  await spawn(npm, ['run', args._[0] ? args._[0] : 'build'], {
    cwd: getCwd()
  });
  await spawn(npm, ['publish', '--access', 'public'], { cwd: getCwd() })
  log(` 🎉🎉🎉 版本发布成功`)
  spawn('git', ['push', 'origin', currentBranch], { cwd: getCwd() })
  process.exit()
}

inquirer
  .prompt({
    type: 'list',
    message,
    name: 'Version',
    default: 'z',
    choices: ['z', 'y', 'x', 'Exit']
  })
  .then(async ({ Version }) => {
    switch (Version) {
      case 'x':
        await command('major')
        break
      case 'y':
        await command('minor')
        break
      case 'z':
        await command('patch')
        break
      case 'Exit':
        process.exit()
    }
  });
