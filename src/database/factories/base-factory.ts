import { Model } from 'mongoose';

export default abstract class BaseFactory<T> {
  constructor(protected amount = 0) {}

  protected abstract definition(): Partial<T>;

  protected abstract model: Model<T>;

  makeOne(overrides?: Partial<T>): T {
    return { ...this.definition(), ...overrides } as T;
  }

  make(overrides?: Partial<T>): T[] {
    const collection: T[] = [];
    for (let i = 0; i < this.amount; i++) {
      collection.push({ ...this.definition(), ...overrides } as T);
    }
    return collection;
  }

  async createOne(overrides?: Partial<T>): Promise<T> {
    return (await this.model.create({ ...this.definition(), ...overrides })) as T;
  }

  async create(overrides?: Partial<T>): Promise<T[]> {
    const collection: T[] = [];
    for (let i = 0; i < this.amount; i++) {
      collection.push((await this.model.create({ ...this.definition(), ...overrides })) as T);
    }
    return collection;
  }
}
