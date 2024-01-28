import {FilterOption} from "../custom-types/custom.types"

export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract getAllByFilter(filterOptions: FilterOption): Promise<T[]>

  abstract get(id: string): Promise<T>;

  abstract create(item: T): Promise<T>;

  abstract update(id: string, item: T);

  abstract delete(id: string);
}
