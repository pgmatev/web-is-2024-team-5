import { HttpService } from './http-service';

// TODO: Abstract it so it's applicable to messages too
export interface IPaginatedConversation {
  page: number;
  limit: number;
  totalPages: number;
  totalConversations: number;
  conversations: Conversation[];
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
}

export interface Conversation {
  id: number;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  groupInfo?: {
    groupName?: string;
    admin: string;
  };
  type: 'private' | 'group';
}

class ConversationService {
  private http = new HttpService();

  async getPaginatedConversations(page: number) {
    const result = await this.http.get<IPaginatedConversation>(
      `/conversations`,
      {
        query: { page: page.toString(), limit: '2' },
      },
    );
    return result;
  }
}

export const conversationService = new ConversationService();
