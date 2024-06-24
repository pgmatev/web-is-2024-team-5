import { Router } from 'express';
import {
  ConversationService,
  conversationInputSchema,
  UserService,
} from '../services';
import { authMiddleware, requestHandlerMiddleware } from '../middlewares';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { IConversation } from '../models/ConversationModel';
import { getUserFromRequestContext } from '../helpers';

export const conversationRouter = Router();
const conversationService = new ConversationService();
const userService = new UserService();

conversationRouter.get(
  '/',
  authMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const currentUser = getUserFromRequestContext(req);

    const conversations =
      await conversationService.getPaginatedConversationsByUserId(
        page,
        limit,
        currentUser.id,
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

conversationRouter.get(
  '/all',
  authMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const currentUser = getUserFromRequestContext(req);
    const groupName = (req.query.groupName as string) || '';
    const participantName = (req.query.participantName as string) || '';
    const userIdsMatchingParticipantName: string[] = [];

    if (participantName) {
      const users = await userService.getUsersBySearchParams(participantName);
      if (users) {
        userIdsMatchingParticipantName.push(...users.map((user) => user.id));
      }
    }

    const conversations = await conversationService.getAllConversationsByFilter(
      groupName,
      userIdsMatchingParticipantName,
      currentUser.id,
    );

    if (!conversations) {
      throw new NotFoundError('No conversations were found');
    }

    res.json({
      conversations,
    });
  }),
);

conversationRouter.post(
  '/',
  authMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const { participants, type } = conversationInputSchema.parse(req.body);
    const currentUser = getUserFromRequestContext(req);

    if (!participants.includes(currentUser.id)) {
      throw new ForbiddenError('Cannot create a chat with these participants');
    }

    if (type == 'private') {
      if (participants.length > 2) {
        throw new BadRequestError('More than 2 participants provided');
      }

      const privateChat =
        await conversationService.findPrivateChat(participants);

      if (privateChat) {
        throw new BadRequestError('Private chat already exists');
      }
    }

    const conversation = await conversationService.createConversation(
      participants,
      type,
      type === 'group' ? currentUser.id : undefined,
    );

    res.send(conversation);
  }),
);
