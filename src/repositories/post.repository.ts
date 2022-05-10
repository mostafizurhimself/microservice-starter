import Repository from '@/contracts/repository';
import Post, { PostDocument, PostRequest } from '@/database/models/post.model';
import { Service } from 'typedi';
import { Criteria, PaginatedResult } from '@/types';

@Service()
export default class PostRepository implements Repository<PostDocument> {
  async find(criteria: Criteria = {}): Promise<PostDocument[]> {
    return await Post.find(criteria);
  }

  async paginate(criteria?: Criteria, currentPage?: number, perPage?: number): Promise<PaginatedResult<PostDocument>> {
    return await Post.paginate(criteria, currentPage, perPage);
  }

  async save(body: PostRequest): Promise<PostDocument> {
    return await Post.create(body);
  }

  async findOne(criteria: Criteria): Promise<PostDocument> {
    return (await Post.findOne(criteria).exec()) as PostDocument;
  }

  async findById(id: string | number): Promise<PostDocument> {
    return (await Post.findById(id).exec()) as PostDocument;
  }

  async update(criteria: Criteria, body: PostRequest): Promise<PostDocument> {
    return (await Post.findOneAndUpdate(criteria, body, {
      new: true,
    })) as PostDocument;
  }

  async delete(id: string): Promise<PostDocument> {
    return (await Post.findByIdAndDelete(id)) as PostDocument;
  }
}
