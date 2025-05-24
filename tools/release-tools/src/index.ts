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
          system: 'system',
          hardware: 'hardware',
        },
      ],
      ['FileInfo', 'package.json'],
    ],
  },
});
