import fsExtra from 'fs-extra';
const { copy } = fsExtra;
async function bootstrap() {
  await copy(
    'C:\\\\Users\\\\tikkhun\\\\AppData\\\\Local\\\\npm-cache\\\\_npx\\\\9fa776dc4e161bad\\\\node_modules\\\\@tikkhun\\\\create-tsup\\\\template',
    './tt',
  );
}
bootstrap();
