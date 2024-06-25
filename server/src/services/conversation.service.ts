import { z } from 'zod';
import { Conversation, IConversation } from '../models/ConversationModel';

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
      .exec();

    if (conversations) {
      return conversations.map((conversation) => conversation.toObject());
    }

    return undefined;
  }

  async getAllConversationsByFilter(
    groupName: string,
    userIdsMatchingParticipantName: string[],
    userId: string,
  ) {
    const query: any = {
      $and: [{ participants: { $all: [userId] } }],
    };
    if (groupName) {
      query.$and.push({ groupName: groupName });
    }
    if (userIdsMatchingParticipantName.length) {
      query.$and.push({
        participants: { $all: userIdsMatchingParticipantName },
      });
    }
    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .exec();

    if (conversations) {
      return conversations.map((conversation) => conversation.toObject());
    }
    return undefined;
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
