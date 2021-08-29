import { adminAuth } from './schemas/adminAuth';
import { article } from './schemas/article';
import { mutation } from './mutation';
import { query } from './query';

export const typeDefs = [query, mutation, adminAuth, article];
