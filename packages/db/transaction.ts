import type { QueryRunner, EntityManager } from 'typeorm'
import { AsyncLocalStorage } from 'node:async_hooks'
import { dataSource } from './source'

const context = new AsyncLocalStorage<QueryRunner>()

export function manager() {
  return context.getStore()?.manager ?? dataSource.manager
}

export async function transaction<T>(
  cb: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const existingQueryRunner = context.getStore()

  if (
    existingQueryRunner &&
    !existingQueryRunner.isReleased &&
    existingQueryRunner.isTransactionActive
  ) {
    return cb(existingQueryRunner.manager)
  }

  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const result = await context.run(queryRunner, () => cb(queryRunner.manager))
    await queryRunner.commitTransaction()
    return result
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    await queryRunner.release()
  }
}
