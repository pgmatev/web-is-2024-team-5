import { Conversation } from '../models/ConversationModel';

export class ConversationService {
  async getPaginatedConversations(page: number = 1, limit: number = 10) {
    const conversations = await Conversation.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (conversations) {
      return conversations.map((conversation) => conversation.toObject());
    }

    return undefined;
  }

  async getTotalConversations() {
    return await Conversation.countDocuments().exec();
  }
}
