export function getServerHostPort() {
  const host = process.env.HOST || '0.0.0.0'
  const port = Number(process.env.PORT) || 3000

  return {
    host,
    port,
  }
}

export function getServerURL(input: { port: number; host: string }) {
  return new URL(`http://${input.host}:${input.port}/`)
}
