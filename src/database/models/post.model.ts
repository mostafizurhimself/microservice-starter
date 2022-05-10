import { Criteria, PaginatedResult } from '@/types';
import mongoose, { Model, Schema } from 'mongoose';
import slug from 'mongoose-slug-generator';
import PostFactory from '@/database/factories/post.factory';

mongoose.plugin(slug);

export interface PostRequest {
  title: string;
  content: string;
}

export interface PostDocument extends PostRequest, mongoose.Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostModel extends Model<PostDocument> {
  paginate(
    criteria?: Criteria,
    currentPage?: number,
    perPage?: number
  ): Promise<any>;
  factory: (amount?: number) => PostFactory;
}

const PostSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, slug: 'title' },
    content: { type: String, required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

PostSchema.index({ parent: 1, tree: 1 });

PostSchema.virtual('id').get(function (this: PostDocument) {
  return this._id;
});

PostSchema.statics.paginate = async function (
  criteria: Criteria = {},
  currentPage = 1,
  perPage = 10
): Promise<PaginatedResult<PostDocument>> {
  const result = await this.find(criteria)
    .sort({ createdAt: -1 })
    .limit(perPage * 1)
    .skip((currentPage - 1) * perPage)
    .exec();

  const count = await this.countDocuments();

  return {
    data: result,
    meta: {
      totalPage: Math.ceil(count / perPage),
      current: currentPage,
      totalItem: count,
      perPage: perPage
    }
  };
};

PostSchema.statics.factory = (amount = 0) => new PostFactory(amount);

const Post = mongoose.model<PostDocument, PostModel>('Post', PostSchema);

export default Post;
