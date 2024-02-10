export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum MatchmakingState {
  IDLE = 'idle',
  IN_QUEUE = 'in_queue',
  IN_GAME = 'in_game',
}

export enum Events {
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  ROOM_ID = 'room_id',
  PLAYERS_STATE = 'players_state',
  TURN_PLAYER_ID = 'turn_player_id',
  WINNERS = 'winners',
  EXCEPTION = 'exception',
  DISCONNECT = 'disconnect',
  QUEUE = 'queue',
  SKIP = 'skip',
  DRAW_CARD = 'draw_card',
}
