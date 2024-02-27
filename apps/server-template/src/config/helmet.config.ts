import helmet from 'helmet';

export function applyHelmet(app) {
  // 防止 @apollo/server等不行用
  const options = {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [
          `'self'`,
          'data:',
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [
          `'self'`,
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  };
  app.use(helmet(options));
}
