import { HttpService } from './http-service';
import { User } from './user-service';

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
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  groupInfo?: {
    name?: string;
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
}

export const conversationService = new ConversationService();