import { Criteria } from '@/types';

interface Repository<T> {
  save?: { (body: any): T | Promise<T> };

  findOne(criteria: Criteria): T | Promise<T>;

  findById(id: string | number): T | Promise<T>;
}

export default Repository;
