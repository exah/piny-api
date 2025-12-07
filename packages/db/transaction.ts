import type { QueryRunner, EntityManager } from 'typeorm'
import { AsyncLocalStorage } from 'node:async_hooks'
import { dataSource } from './source'

const storage = new AsyncLocalStorage<QueryRunner>()
let pending: Promise<unknown> = Promise.resolve()

export function manager() {
  return storage.getStore()?.manager ?? dataSource.manager
}

export async function transaction<T>(
  cb: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const existingQueryRunner = storage.getStore()

  if (
    existingQueryRunner &&
    !existingQueryRunner.isReleased &&
    existingQueryRunner.isTransactionActive
  ) {
    return cb(existingQueryRunner.manager)
  }

  const createTransaction = async () => {
    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const result = await storage.run(queryRunner, () => cb(queryRunner.manager))
      await queryRunner.commitTransaction()
      return result
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  await pending
  const transaction = createTransaction()
  pending = Promise.allSettled([transaction])

  return transaction
}
