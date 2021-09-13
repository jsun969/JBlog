import { adminAuth } from './adminAuth';
import { createArticle } from './createArticle';
import { createFriend } from './createFriend';
import { deleteArticle } from './deleteArticle';
import { likeArticle } from './likeArticle';
import { modifyAbout } from './modifyAbout';
import { modifyArticle } from './modifyArticle';

export const resolvers = {
  Query: { adminAuth },
  Mutation: { createArticle, deleteArticle, likeArticle, modifyArticle, modifyAbout, createFriend },
};
