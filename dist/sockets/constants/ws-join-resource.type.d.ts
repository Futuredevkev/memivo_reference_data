import { WS_JOIN_RESOURCE } from './ws-join-resource.constant';
export type WsJoinResource = (typeof WS_JOIN_RESOURCE)[keyof typeof WS_JOIN_RESOURCE];
