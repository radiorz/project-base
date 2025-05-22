export default {
  workspace: 'D:\\code\\project-base\\tools\\release-tools',
  include: ['**/*'],
  exclude: ['**/node_modules/**', '**/release/**', '**/deploy/**', '**/.git/**', '**/.vscode/**'],
  archiveType: 'zip',
  clean: true,
  releasePathRelative: 'cwd',
  releasePath: 'release',
  infoBuilderOptions: {
    workspace: 'D:\\code\\project-base\\tools\\release-tools',
    configType: 'packageJson',
    input: {
      subname: 'tools',
      name: 'release-tools',
    },
  },
  infoStoreOptions: {
    enabled: true,
    transformMap: {},
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
    path: 'released_info.json',
  },
  releaseNameOptions: {
    params: ['subname', 'name', 'version', 'releasedAt'],
    paramDelimiter: '_',
    releasedAtPattern: 'YYYY-MM-DD-HH-mm-ss',
  },
  inputMoveOptions: {
    items: [],
  },
};
