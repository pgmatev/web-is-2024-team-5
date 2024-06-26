import { Router } from 'express';
import {
  ConversationService,
  UserService,
  conversationInputSchema,
  MessageService,
  groupInfoSchema,
} from '../services';
import { authMiddleware, requestHandlerMiddleware } from '../middlewares';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { getUserFromRequestContext } from '../helpers';
import { IConversation } from '../models/ConversationModel';

export const conversationRouter = Router();
const conversationService = new ConversationService();
const userService = new UserService();
const messageService = new MessageService();

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
    const search = req.query['search'] as string;

    const conversations =
      await conversationService.getAllConversationsBySearchParam(
        currentUser.id,
        search,
      );

    if (!conversations) {
      throw new NotFoundError('No conversations were found');
    }

    res.send(conversations);
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

conversationRouter.put(
  '/:id',
  authMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const groupInfo = groupInfoSchema.parse(req.body['groupInfo']);
    const id = req.params['id'];
    const currentUser = getUserFromRequestContext(req);

    const conversation = await conversationService.updateConversationGroupInfo(
      currentUser,
      id,
      groupInfo,
    );

    res.send(conversation);
  }),
);

conversationRouter.get(
  `/:id/messages`,
  authMiddleware,
  requestHandlerMiddleware(async (req, res) => {
    const id = req.params['id'];
    const currentUser = getUserFromRequestContext(req);

    const conversation = await conversationService.getConversationById(id);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(currentUser.id)) {
      throw new ForbiddenError('Cannot access this conversation');
    }

    const messages = await messageService.getMessagesByConversationId(
      conversation.id,
    );

    res.send(messages);
  }),
);
