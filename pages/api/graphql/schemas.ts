import { query } from './query';
import { mutation } from './mutation';

import { adminAuth } from './schemas/adminAuth';
import { article } from './schemas/article';

export const typeDefs = [query, mutation, adminAuth, article];
