import { PostDocument } from '@/database/models/post.model';
import validate from '@/middleware/validation.middleware';
import PostRepository from '@/repositories/post.repository';
import { ApiResponse, PaginatedResult, PaginatedQuery } from '@/types';
import { postCreateRules, postUpdateRules, postParamRules } from '@/validators/post.validator';
import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, UseBefore, Param, Put, Delete } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@Controller()
export class PostController {
  constructor(@Inject() public repository: PostRepository) {}

  @Get('/posts')
  async index(
    @Req()
      req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, PaginatedQuery>,
    @Res() res: Response<ApiResponse>
  ) {
    if (req.query.withoutPagination) {
      const result = await this.repository.find();
      return res.json({ data: result });
    }
    const result = (await this.repository.paginate(
      {},
      req.query.page,
      req.query.limit
    )) as PaginatedResult<PostDocument>;
    return res.json(result);
  }

  @Post('/posts')
  @UseBefore(validate(postCreateRules))
  async create(@Req() req: Request, @Res() res: Response<ApiResponse>) {
    const post = await this.repository.save(req.body);
    return res.json({
      message: 'Post created successfully.',
      data: post,
    });
  }

  @Get('/posts/:id')
  @UseBefore(validate(postParamRules))
  async show(@Param('id') id: string, @Req() req: Request, @Res() res: Response<ApiResponse>) {
    const post = await this.repository.findById(id);
    if (post) {
      return res.json({ message: 'Post found.', data: post });
    }
    return res.status(404).json({ message: 'No resource found.' });
  }

  @Put('/posts/:id')
  @UseBefore(validate(postUpdateRules))
  async update(@Param('id') id: string, @Req() req: Request, @Res() res: Response<ApiResponse>) {
    const post = await this.repository.update({ _id: id }, req.body);
    if (post) {
      return res.json({
        message: 'Post updated successfully.',
        data: post,
      });
    }
    return res.status(404).json({ message: 'No resource found.' });
  }

  @Delete('/posts/:id')
  @UseBefore(validate(postParamRules))
  async delete(@Param('id') id: string, @Req() req: Request, @Res() res: Response<ApiResponse>) {
    const post = await this.repository.delete(id);
    if (post) {
      return res.json({ message: 'Post deleted successfully.' });
    }
    return res.status(404).json({ message: 'No resource found.' });
  }
}
