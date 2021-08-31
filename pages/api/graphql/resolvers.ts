import { adminAuth } from './resolvers/adminAuth';
import { createArticle } from './resolvers/createArticle';
import { likeArticle } from './resolvers/likeArticle';
import merge from 'lodash.merge';

export const resolvers = merge(adminAuth, createArticle, likeArticle);
