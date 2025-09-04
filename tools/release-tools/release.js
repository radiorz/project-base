import { defineConfig } from './dist/lib';
export default defineConfig({
  workspace: 'D:\\code\\project-base\\tools\\release-tools',
  include: ['**/*', 'D:/code/project-base/tools/version/**/*'],
  exclude: ['**/node_modules/**', '**/release/**', '**/deploy/**', '**/.git/**', '**/.vscode/**'],
  archiveType: 'zip',
  clean: true,
  releasePathRelative: 'cwd',
  releasePath: 'release',
  getInfoOptions: {
    from: [
      ['package.json'],
      [
        {
          system: 'linux',
          tag: 'beta',
        },
      ],
      {
        webInfo: ['D:\\code\\project-base\\tools\\release-plugins\\info\\package.json'],
      },
    ],
  },
  releaseNameOptions: {
    params: ['name', 'version', 'releasedAt', 'system', 'tag', 'description'],
    paramDelimiter: '_',
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
  },
  infoStoreOptions: {
    enabled: true,
    transformMap: {},
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
    path: 'released_info.json',
  },
  inputMoveOptions: {
    items: [
      {
        source: 'D:/code/project-base/tools/version',
        target: 'version',
      },
    ],
  },
});
