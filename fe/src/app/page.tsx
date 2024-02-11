'use client';

import emojify from 'emojify-hashes';
import Image from 'next/image';
import { useMemo } from 'react';

import Circlegraph from './_shared/components/circlegraph';
import Header from './_shared/components/header';
import Instructions from './_shared/components/instructions';
import { PlayerCardSummary } from './_shared/components/player-card';
import { useGameSocket } from './_shared/hooks/game-socket';

import styles from './page.module.scss';

export default function Home() {
  const {
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
  } = useGameSocket();

  const room = useMemo(() => {
    return roomId
      ? emojify(
          roomId
            .split('')
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join(''),
        ).join('')
      : null;
  }, [roomId]);

  const result = useMemo(() => {
    if (!winners) return;

    if (winners.playerIds.find((id) => id === player?.id)) {
      return (
        <div className={styles['result--winner']}>
          {winners.playerIds.length > 1
            ? 'You are among the winners!'
            : 'You won!'}
          &nbsp;Your point: {winners.point}
        </div>
      );
    }

    return (
      <div className={styles['result--loser']}>
        You lost! Winner point: {winners.point}
      </div>
    );
  }, [winners, player]);

  const queueAction = useMemo(() => {
    if (!player) return;

    switch (matchmakingState) {
      case 'idle':
        return (
          <button className={styles['actions__queue']} onClick={startQueue}>
            Start
          </button>
        );
      case 'in_queue':
        return (
          <button className={styles['actions__queue']} disabled>
            In queue{' '}
            <Image
              src="/images/magnify.svg"
              alt=""
              height={30}
              width={30}
            ></Image>
          </button>
        );
      case 'in_game':
        return null;
    }
  }, [player, matchmakingState, startQueue]);

  const ingameAction = useMemo(() => {
    if (matchmakingState !== 'in_game' || turnPlayerId !== player?.id) return;
    return (
      <>
        <button onClick={drawCard}>Draw card</button>
        <button onClick={skipTurn}>Skip turn</button>
      </>
    );
  }, [matchmakingState, player, turnPlayerId, drawCard, skipTurn]);

  return (
    <>
      <Header />
      <div className={styles['game-page']}>
        <div className={room ? styles.float : ''}>
          {room && <div>Room: {room}</div>}
          {!winners && <Instructions />}
          <div>{error}</div>
        </div>

        <div className={styles.actions}>{queueAction}</div>

        {result && (
          <div className={styles.result}>
            {result}
            {winners && player && playersState && (
              <div>
                {Object.entries(winners.breakdown).map(([playerId, point]) => (
                  <PlayerCardSummary
                    key={playerId}
                    isMe={playerId === player?.id}
                    username={
                      playersState[playerId]?.playerUsername || player.username
                    }
                    point={point}
                    winnersPoint={winners.point}
                  />
                ))}
              </div>
            )}
            <button onClick={() => location.reload()}>Play again</button>
          </div>
        )}

        {player && playersState && (
          <div
            className={`${styles['circlegraph-container']} ${
              winners ? styles['fade-out'] : ''
            }`}
          >
            <Circlegraph
              player={player}
              playersState={playersState}
              turnPlayerId={turnPlayerId}
            />

            <div className={styles.interaction}>
              {playersState && !winners && (
                <div>
                  You now have {points} points.{' '}
                  {ingameAction && 'Make a choice:'}
                </div>
              )}
              <div className={styles.actions}>{ingameAction}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
