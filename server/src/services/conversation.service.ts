import { z } from 'zod';
import { Conversation, IConversation } from '../models/ConversationModel';
import { generateRegexTermsFromSearch } from '../helpers';
import mongoose from 'mongoose';
import _ from 'lodash';
import { IUser } from '../models/UserModel';

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
      const conversations = await Conversation.aggregate([
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
            // 'participants._id': 0, couldn't find a way to rename it
            messages: 0,
          },
        },
        {
          $unwind: '$participants',
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
      ])
        .sort({ updatedAt: -1 })
        .exec();

      // The ugly result of not being able to rename _id
      return conversations.map((conversation) =>
        _.omit(
          {
            ...conversation,
            id: conversation._id,
            participants: conversation.participants.map((participant: IUser) =>
              _.omit({ ...participant, id: participant._id }, '_id'),
            ),
          },
          '_id',
        ),
      );
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
}
