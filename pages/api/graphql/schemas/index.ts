import { adminAuth } from './adminAuth';
import { article } from './article';
import { mutation } from '../mutation';
import { query } from '../query';

export const typeDefs = [query, mutation, adminAuth, article];
