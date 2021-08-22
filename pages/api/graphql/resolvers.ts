import { adminAuth } from './resolvers/adminAuth';
import { createArticle } from './resolvers/createArticle';

export const resolvers = { ...adminAuth, ...createArticle };
