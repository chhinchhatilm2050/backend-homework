import { Router } from "express";
import { followUser, unFollow, getFollower, getFollowing, checkFollowing } from "../controllers/followerController.js";
const followRouter = Router();
followRouter.post('/:id/follow', followUser);
followRouter.delete('/:id/unfollow', unFollow);
followRouter.get('/:id/followers', getFollower);
followRouter.get('/:id/following', getFollowing);
followRouter.get('/:id/is-following/:targetId', checkFollowing);

export {followRouter};