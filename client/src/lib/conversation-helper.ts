import { Conversation } from '../services/conversation-service.ts';
import { User } from '../services/user-service.ts';
import { getUserName } from './user-helper.ts';

export const getConversationName = (
  conversation: Conversation,
  currentUser: User,
) => {
  if (conversation.participants.length === 1) {
    return getUserName(conversation.participants[0]);
  }

  if (conversation.type === 'private') {
    return conversation.participants
      .filter((participant) => participant.id !== currentUser.id)
      .map((participant) => getUserName(participant))
      .join(', ');
  }

  return (
    conversation.groupInfo?.name ??
    conversation.participants
      .filter((participant) => participant.id !== currentUser.id)
      .map((participant) => participant.firstName)
      .join(', ')
  );
};
