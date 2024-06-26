import { HttpService } from './http-service';
import { User } from './user-service';
import { TMessage } from '../types';

// TODO: Abstract it so it's applicable to messages too
export interface IPaginatedConversation {
  page: number;
  limit: number;
  totalPages: number;
  totalConversations: number;
  conversations: Conversation[];
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: string[];
  lastMessage?: TMessage;
  groupInfo?: {
    name?: string;
    adminId: string;
  };
  type: 'private' | 'group';
  createdAt: string;
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

  async createConversation(participants: string[]) {
    const result = await this.http.post<Conversation>(`/conversations`, {
      body: {
        participants,
        // TODO: Allow users to chose wether it is a group or private (ALlow groups of 2)
        type: participants.length > 2 ? 'group' : 'private',
      },
    });

    return result;
  }

  async getAllConversations(search?: string) {
    const result = await this.http.get<Conversation[]>(`/conversations/all`, {
      query: search
        ? {
            search,
          }
        : {},
    });
    return result;
  }

  async updateConversationName(
    conversationId: string,
    groupInfo: Partial<Conversation['groupInfo']>,
  ) {
    const result = await this.http.put<Conversation>(
      `/conversations/${conversationId}`,
      {
        body: {
          groupInfo,
        },
      },
    );
    return result;
  }

  async getAllMessages(conversationId?: string) {
    return await this.http.get<TMessage[]>(
      `/conversations/${conversationId}/messages`,
    );
  }
}

export const conversationService = new ConversationService();
