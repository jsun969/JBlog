import { adminAuth } from './resolvers/adminAuth';
import { createArticle } from './resolvers/createArticle';
import { deleteArticle } from './resolvers/deleteArticle';
import { likeArticle } from './resolvers/likeArticle';
import merge from 'lodash.merge';
import { modifyArticle } from './resolvers/modifyArticle';

export const resolvers = merge(adminAuth, createArticle, likeArticle, deleteArticle, modifyArticle);
