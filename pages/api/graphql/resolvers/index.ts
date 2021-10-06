import { adminAuth } from './adminAuth';
import { createArticle } from './createArticle';
import { createFriend } from './createFriend';
import { deleteArticle } from './deleteArticle';
import { deleteEmptyTags } from './deleteEmptyTags';
import { deleteFriend } from './deleteFriend';
import { likeArticle } from './likeArticle';
import { modifyAbout } from './modifyAbout';
import { modifyArticle } from './modifyArticle';
import { modifyBulletin } from './modifyBulletin';
import { modifyFriend } from './modifyFriend';
import { modifyFriendsOrder } from './modifyFriendsOrder';

export const resolvers = {
  Query: { adminAuth },
  Mutation: {
    createArticle,
    deleteArticle,
    likeArticle,
    modifyArticle,
    modifyAbout,
    createFriend,
    modifyFriend,
    deleteFriend,
    modifyBulletin,
    modifyFriendsOrder,
    deleteEmptyTags,
  },
};
