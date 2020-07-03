import { DenonConfig } from 'https://deno.land/x/denon/mod.ts'

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: 'deno run server.ts',
      desc: 'Run the app',
      allow: ['env', 'net', 'read', 'write'],
      unstable: true,
      tsconfig: 'tsconfig.json',
    },
    sync: {
      cmd: 'deno run sync.ts',
      desc: 'Create empty database',
      allow: ['env', 'net', 'read', 'write'],
      unstable: true,
      tsconfig: 'tsconfig.json',
      watch: false,
    },
  },
}

export default config
