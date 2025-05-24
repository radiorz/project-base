import { TikkhunRelease } from '../lib';

TikkhunRelease({
  getInfoOptions: {
    from: [
      [
        'package.json',
        {
          name: 'name',
          version: 'version',
          description: 'description',
          tag: 'tag',
        },
      ],
      ['FileInfo', 'package.json'],
      [
        {
          system: 'any',
          hardware: 'any',
        },
      ],
    ],
  },
});
