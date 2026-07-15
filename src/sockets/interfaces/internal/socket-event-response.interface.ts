export interface SocketEventResponse<TEvent extends string, TData> {
  event: TEvent;
  data: TData;
}
