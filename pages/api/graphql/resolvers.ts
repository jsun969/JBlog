import { adminAuth } from './resolvers/adminAuth';
import { createArticle } from './resolvers/createArticle';
import { likeArticle } from './resolvers/likeArticle';

export const resolvers = { ...adminAuth, ...createArticle, ...likeArticle };
