import { OutgoingChatMessage } from '../../../shared/types';

export type TMessage = OutgoingChatMessage & {
  id: string;
};
