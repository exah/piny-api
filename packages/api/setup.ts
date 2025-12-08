import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONMENT ?? 'development',
  enableLogs: true,
  integrations: [Sentry.pinoIntegration()],
  tracesSampleRate: 0.1,
})
