import { PostDocument } from '@/database/models/post.model';
import PostRepository from '@/repositories/post.repository';
import Repository from '@/contracts/repository';
import { body, param } from 'express-validator';
import { Types } from 'mongoose';
import { Container } from 'typedi';

const rules = [
  body('content')
    .optional({ checkFalsy: true, nullable: true })
    .isLength({ min: 5, max: 500 })
    .withMessage('Post content should be 5 to 500 character.')
];

export const postCreateRules = [
  body('title', 'Post title is required')
    .notEmpty()
    .bail()
    .custom(async (value) => {
      const repository = Container.get(
        PostRepository
      ) as Repository<PostDocument>;
      const post = await repository.findOne({ title: value });
      if (post) {
        return Promise.reject('This title has already taken.');
      }
    }),
  ...rules
];

export const postUpdateRules = [
  param('id', 'Invalid post id')
    .exists()
    .custom((value) => {
      return Types.ObjectId.isValid(value);
    }),

  body('title', 'Post title is required')
    .notEmpty()
    .bail()
    .custom(async (value, { req }) => {
      const repository = Container.get(
        PostRepository
      ) as Repository<PostDocument>;
      if (req.params && req.params.id) {
        const post = await repository.findOne({
          _id: { $ne: req.params.id },
          title: value
        });
        if (post) {
          return Promise.reject('This title has already taken.');
        }
      }
    }),

  body('content', 'Post content should be 5 to 500 character.').isLength({
    min: 5,
    max: 100
  })
];

export const postParamRules = [
  param('id', 'Invalid post id')
    .exists()
    .custom((value) => {
      return Types.ObjectId.isValid(value);
    })
];
