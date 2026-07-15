import type { ChatGroupCreatedSocketData } from './chat-group-created-socket-data.interface';
export interface GroupCreatedPayload<TGroup = ChatGroupCreatedSocketData> {
    albumId: string;
    group: TGroup;
}
