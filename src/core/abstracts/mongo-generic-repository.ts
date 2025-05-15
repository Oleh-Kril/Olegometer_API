import { Model, AnyKeys } from 'mongoose';
import {IGenericRepository} from "./generic-repository.abstract"
import {FilterOption} from "../custom-types/custom.types"

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  getAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec();
  }

  getAllByFilter(filterOptions: FilterOption): Promise<T[]> {
    return this._repository.find(filterOptions).populate(this._populateOnFind).exec();
  }

  get(id: any): Promise<T | null> {
    // @ts-ignore
    return this._repository.findById(id).populate(this._populateOnFind).exec();
  }

  async getByName(name: string): Promise<T | null> {
    return this._repository.findOne({ name } as any).populate(this._populateOnFind).exec();
  }

  create(itemData: AnyKeys<T>): Promise<T> {
    return this._repository.create(itemData);
  }

  update(id: string, item: Partial<T>) {
    return this._repository.findByIdAndUpdate(id, item, { new: true });
  }

  delete(id: string): Promise<T | null> {
    // @ts-ignore
    return this._repository.findByIdAndDelete(id).exec();
  }
}
