import { ArchiveType, Release } from '../lib';

const release = new Release({
  archiveType: ArchiveType.zipEncrypted,
  archiveOptions: {
    encryptionMethod: 'aes256',
    password: '123',
  },
});
release.start();
