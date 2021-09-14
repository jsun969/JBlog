import { adminAuth } from './adminAuth';
import { createArticle } from './createArticle';
import { createFriend } from './createFriend';
import { deleteArticle } from './deleteArticle';
import { deleteFriend } from './deleteFriend';
import { likeArticle } from './likeArticle';
import { modifyAbout } from './modifyAbout';
import { modifyArticle } from './modifyArticle';
import { modifyFriend } from './modifyFriend';

export const resolvers = {
  Query: { adminAuth },
  Mutation: { createArticle, deleteArticle, likeArticle, modifyArticle, modifyAbout, createFriend, modifyFriend, deleteFriend },
};
