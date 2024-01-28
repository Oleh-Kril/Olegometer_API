export abstract class IStorageRepository<T> {
  abstract get(id: string): Promise<T>;

  abstract createOrUpdate(id: string, item: T): Promise<T>;

  abstract delete(id: string);
}
