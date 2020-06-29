import { DenonConfig } from 'https://deno.land/x/denon/mod.ts'

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: 'deno run app/mod.ts',
      desc: 'Run the app',
      allow: ['env', 'net', 'read', 'write'],
      unstable: true,
      tsconfig: 'tsconfig.json',
    },
  },
}

export default config
