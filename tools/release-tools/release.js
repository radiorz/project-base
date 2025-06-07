export default {
  workspace: 'D:\\code\\project-base\\tools\\release-tools',
  include: ['**/*'],
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
    ],
  },
  infoStoreOptions: {
    enabled: true,
    transformMap: {},
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
    path: 'released_info.json',
  },
  releaseNameOptions: {
    params: ['subname', 'name', 'version', 'releasedAt', 'description'],
    paramDelimiter: '_',
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
  },
  inputMoveOptions: {
    items: [],
  },
};
