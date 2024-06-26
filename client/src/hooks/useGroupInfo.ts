import { getConversationName } from '../lib/conversation-helper';
import { Conversation } from '../services/conversation-service.ts';
import { User } from '../services/user-service.ts';
import { useMemo } from 'react';

export const useGroupInfo = (chat: Conversation, user: User | undefined) => {
  return useMemo(() => {
    if (chat.type === 'group') {
      return (
        chat.groupInfo?.name ??
        chat.participants
          .map((participant) => {
            const initial = participant.lastName[0];
            return `${participant.firstName} ${initial}.`;
          })
          .join(', ')
      );
    }

    const participantsExcludingCurrentUser = chat.participants.filter(
      (participant) => {
        return participant.id !== user?.id;
      },
    );

    if (participantsExcludingCurrentUser.length === 1) {
      return `${getConversationName(chat, user!)}`;
    }

    return 'Yourself';
  }, [chat, user]);
};
