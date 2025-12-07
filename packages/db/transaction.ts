import type { EntityManager } from 'typeorm'
import { AsyncLocalStorage } from 'node:async_hooks'
import { dataSource } from './source'

const context = new AsyncLocalStorage<EntityManager>()

export function manager() {
  return context.getStore() ?? dataSource.manager
}

export async function transaction<T>(
  cb: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const existingManager = context.getStore()

  if (existingManager?.queryRunner?.isTransactionActive) {
    return cb(existingManager)
  }

  return dataSource.transaction((manager) => context.run(manager, () => cb(manager)))
}
