import { Conversation } from '../services/conversation-service.ts';
import { User } from '../services/user-service.ts';
import { useMemo } from 'react';
import { generateDisplayUsername } from '../lib/generateDisplayUsername.ts';

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
      return `${generateDisplayUsername(participantsExcludingCurrentUser[0])}`;
    }

    return 'Yourself';
  }, [chat.groupInfo?.name, chat.participants, chat.type, user?.id]);
};
