import { useAppSelector } from '@/redux/hooks';
import { AsyncStatus } from '@/redux/utils/reducers';
import { getToken } from '@/redux/utils/token';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import {
  Events,
  IdResponse,
  MatchmakingState,
  PlayersState,
  WinnersResponse,
} from '../models/game';

export function useGameSocket() {
  const socket = useRef<Socket>();
  const player = useAppSelector((state) => state.playerReducer.player);

  const [matchmakingState, setMatchmakingState] = useState<MatchmakingState>();
  const [roomId, setRoomId] = useState<string>();
  const [playersState, setPlayersState] = useState<PlayersState>();
  const [turnPlayerId, setTurnPlayerId] = useState<string>();
  const [winners, setWinners] = useState<WinnersResponse>();
  const [error, setError] = useState<string>();

  const cleanup = () => {
    setRoomId(undefined);
    setPlayersState(undefined);
    setTurnPlayerId(undefined);
    setWinners(undefined);
    setError(undefined);
    setMatchmakingState(MatchmakingState.DISCONNECTED);
  };

  useEffect(() => {
    if (!player) return;

    socket.current = io(process.env.NEXT_PUBLIC_WS_URL as string, {
      extraHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    socket.current.on(Events.CONNECT, () => {
      setMatchmakingState(MatchmakingState.IDLE);
      socket.current?.emit(Events.RECONNECT);
    });
    socket.current.on(Events.ROOM_ID, (data: { id: string }) => {
      setMatchmakingState(MatchmakingState.IN_GAME);
      setRoomId(data.id);
    });
    socket.current.on(Events.PLAYERS_STATE, (data: PlayersState) => {
      setPlayersState(data);
    });
    socket.current.on(Events.TURN_PLAYER_ID, (data: IdResponse) => {
      setTurnPlayerId(data.id);
    });
    socket.current.on(Events.WINNERS, (data: WinnersResponse) => {
      setWinners(data);
    });
    socket.current.on(Events.EXCEPTION, (data: any) => {
      setError(data);
    });
    socket.current.on(Events.DISCONNECT, () => {
      cleanup();
    });

    return () => {
      socket.current?.disconnect();
      cleanup();
    };
  }, [player]);

  const points = useMemo(() => {
    if (!playersState || !player) return 0;

    const cards = playersState[player.id].cards;
    return (
      (cards || []).reduce((total, card) => {
        const point = card.rank === 'A' ? 1 : Number(card.rank);
        if (isFinite(point)) {
          total += point;
        }
        return total;
      }, 0) % 10
    );
  }, [playersState, player]);

  const startQueue = useCallback(() => {
    socket.current?.emit(Events.QUEUE, {}, (response: AsyncStatus) => {
      if (response.status === 'success') {
        setMatchmakingState(MatchmakingState.IN_QUEUE);
      }
    });
  }, [socket]);

  const drawCard = useCallback(() => {
    socket.current?.emit(Events.DRAW_CARD, {});
  }, [socket]);

  const skipTurn = useCallback(() => {
    socket.current?.emit(Events.SKIP, {});
  }, [socket]);

  return {
    player,
    matchmakingState,
    roomId,
    points,
    playersState,
    turnPlayerId,
    winners,
    error,
    startQueue,
    drawCard,
    skipTurn,
  };
}
