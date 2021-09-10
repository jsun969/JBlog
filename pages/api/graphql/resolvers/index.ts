import { adminAuth } from './adminAuth';
import { createArticle } from './createArticle';
import { deleteArticle } from './deleteArticle';
import { likeArticle } from './likeArticle';
import { modifyArticle } from './modifyArticle';

export const resolvers = {
  Query: { adminAuth },
  Mutation: { createArticle, deleteArticle, likeArticle, modifyArticle },
};
