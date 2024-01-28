import { Model } from 'mongoose';
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

  get(id: any): Promise<T> {
    // @ts-ignore
    return this._repository.findById(id).populate(this._populateOnFind).exec();
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  update(id: string, item: T) {
    return this._repository.findByIdAndUpdate(id, item);
  }

  delete(id: string): Promise<void> {
    // @ts-ignore
    return this._repository.findByIdAndDelete(id).exec();
  }
}
