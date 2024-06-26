import { z } from 'zod';
import { Conversation, IConversation } from '../models/ConversationModel';
import { generateRegexTermsFromSearch } from '../helpers';
import mongoose from 'mongoose';
import { IUser } from '../models/UserModel';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { ObjectId } from 'mongodb';

export const conversationInputSchema = z.object({
  type: z.enum(['group', 'private']),
  participants: z
    .array(
      z.string().refine(
        (val) => {
          return /^[0-9a-fA-F]{24}$/.test(val);
        },
        {
          message: 'Invalid ObjectId format',
        },
      ),
    )
    // 1 to enable chat with yourself
    .min(1, { message: 'At least one participant is required' }),
});

export const groupInfoSchema = z.object({
  name: z.string().optional(),
  adminId: z.instanceof(ObjectId).optional(),
});

type GroupInfoInput = z.infer<typeof groupInfoSchema>;

export class ConversationService {
  async getPaginatedConversationsByUserId(
    page: number = 1,
    limit: number = 10,
    userId: string,
  ) {
    const conversations = await Conversation.find({
      participants: { $all: userId },
    })
      .select('-messages')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('participants')
      .exec();

    if (conversations) {
      return conversations.map((conversation) => conversation.toObject());
    }

    return undefined;
  }

  async getAllConversationsByUserId(userId: string) {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .select('-messages')
      .sort({ updatedAt: -1 })
      .exec();

    if (!conversations) {
      return undefined;
    }

    return conversations.map((conversation) => conversation.toObject());
  }

  async getAllConversationsBySearchParam(
    currentUserId: string,
    search?: string,
  ) {
    const terms = generateRegexTermsFromSearch(search);

    const termConditions = [
      { 'participants.firstName': { $in: terms } },
      { 'participants.lastName': { $in: terms } },
      { 'groupInfo.name': { $in: terms } },
    ];

    try {
      return await Conversation.aggregate([
        {
          $match: {
            $and: [
              { participants: new mongoose.Types.ObjectId(currentUserId) },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'participants',
            foreignField: '_id',
            as: 'participants',
          },
        },
        {
          $match: {
            $or: termConditions,
          },
        },
        {
          $project: {
            'participants.password': 0,
            'participants.__v': 0,
            messages: 0,
          },
        },
        {
          $unwind: '$participants',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'lastMessage.sender',
            foreignField: '_id',
            as: 'lastMessage.sender',
          },
        },
        {
          $project: {
            'lastMessage.sender.password': 0,
            'lastMessage.sender.__v': 0,
          },
        },
        {
          $unwind: {
            path: '$lastMessage.sender',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            type: { $first: '$type' },
            participants: { $push: '$participants' },
            messages: { $first: '$messages' },
            groupInfo: { $first: '$groupInfo' },
            lastMessage: { $first: '$lastMessage' },
            updatedAt: { $first: '$updatedAt' },
          },
        },
        {
          $addFields: {
            id: '$_id',
            participants: {
              $map: {
                input: '$participants',
                as: 'participant',
                in: {
                  $mergeObjects: ['$$participant', { id: '$$participant._id' }],
                },
              },
            },
            'lastMessage.id': '$lastMessage._id',
            'lastMessage.sender.id': '$lastMessage.sender._id',
          },
        },
        {
          $project: {
            _id: 0,
            'participants._id': 0,
            'lastMessage._id': 0,
            'lastMessage.sender._id': 0,
            messages: 0,
          },
        },
      ])
        .sort({ updatedAt: -1 })
        .exec();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getTotalConversations() {
    return await Conversation.countDocuments().exec();
  }

  async getConversationById(conversationId: string) {
    const conversation = await Conversation.findById(conversationId).exec();

    if (conversation) {
      return conversation.toObject();
    }

    return undefined;
  }

  async createConversation(
    participants: string[],
    type: 'group' | 'private',
    adminId?: string,
  ) {
    const conversation = new Conversation({
      type,
      participants,
      messages: [],
      groupInfo: {
        adminId,
      },
    });
    await conversation.save();
    return conversation.toObject();
  }

  async findPrivateChat(participants: string[]) {
    const conversation = await Conversation.findOne({
      type: 'private',
      participants: { $all: participants, $size: participants.length },
    });

    if (conversation) {
      return conversation.toObject();
    }

    return undefined;
  }

  async updateConversationGroupInfo(
    currentUser: IUser,
    conversationId: string,
    groupInfo: Partial<IConversation['groupInfo']>,
  ) {
    const conversation = await Conversation.findById(conversationId).exec();

    if (!conversation) {
      throw new NotFoundError('Conversation not found.');
    }

    if (conversation.type !== 'group' || !conversation.groupInfo) {
      throw new BadRequestError('Cannot update non-group conversations.');
    }

    if (currentUser.id !== conversation.groupInfo.adminId.toString()) {
      throw new ForbiddenError(
        'You do not have permission to update this conversation.',
      );
    }

    conversation.groupInfo = { ...conversation.groupInfo, ...groupInfo };

    await conversation.save();

    return conversation.toObject();
  }
}
