import { Message } from '../models/MessageModel';

export class MessageService {
  async getMessagesByConversationId(conversationId: string) {
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender')
      .sort({ createdAt: -1 })
      .exec();

    if (messages.length > 0) {
      return messages.map((message) => message.toObject());
    }

    return [];
  }
}
