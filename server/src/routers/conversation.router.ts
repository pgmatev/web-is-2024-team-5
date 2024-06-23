import { Router } from 'express';
import { ConversationService } from '../services';
import { authMiddleware, requestHandlerMiddleware } from '../middlewares';
import { NotFoundError } from '../errors';

export const conversationRouter = Router();
const conversationService = new ConversationService();

conversationRouter.get(
  '/',
  authMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const conversations = await conversationService.getPaginatedConversations(
      page,
      limit,
    );

    const totalConversations =
      await conversationService.getTotalConversations();

    if (!conversations) {
      throw new NotFoundError('No conversations were found');
    }

    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalConversations / limit),
      totalConversations,
      conversations,
    });
  }),
);
