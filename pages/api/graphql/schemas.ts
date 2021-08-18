import { query } from './query';
import { adminAuthSchema } from './query/adminAuth';

export const typeDefs = [query, adminAuthSchema];
