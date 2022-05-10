import { faker } from '@faker-js/faker';
import BaseFactory from './base-factory';
import Post, { PostDocument, PostRequest } from '@/database/models/post.model';

export default class PostFactory extends BaseFactory<PostDocument> {
  protected model = Post;

  protected definition() {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
    } as PostRequest;
  }
}
