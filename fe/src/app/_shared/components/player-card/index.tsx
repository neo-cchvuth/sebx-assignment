import { PlayerState } from '@/app/_shared/models/game';
import Image from 'next/image';

import Avatar from '../avatar';

import styles from './index.module.scss';

interface PlayerCardProps {
  player: PlayerState;
  turnPlayerId: string | undefined;
  isMe?: boolean;
}
export function PlayerCard({ player, turnPlayerId, isMe }: PlayerCardProps) {
  return (
    <div
      key={player.playerId}
      className={`${styles.player} ${isMe ? styles.me : ''} ${
        player.playerId === turnPlayerId ? styles['player--active'] : ''
      }`}
    >
      <h5 className={styles['player__name']}>
        {isMe ? 'You' : player.playerUsername}
      </h5>
      <Avatar seed={player.playerUsername} height={70} width={70} />
      <div className={styles['player__cards']}>
        {player.cards
          ? player.cards.map((card) => (
              <div
                key={card.value}
                className={`${styles.card} ${styles['my-card']}`}
                style={{
                  color:
                    card.suite === 'diamonds' || card.suite === 'hearts'
                      ? 'red'
                      : 'black',
                }}
              >
                {card.value}
              </div>
            ))
          : Array.from(Array(player.cardsCount)).map((_, i) => (
              <Image
                key={i}
                alt=""
                className={styles.card}
                src="/images/card_back.svg"
                height="60"
                width="40"
              ></Image>
            ))}
      </div>
      <div className={styles['player__status']}>
        {turnPlayerId === player.playerId ? 'thinking...' : ''}
      </div>
    </div>
  );
}

interface PlayerCardSummaryProps {
  point: number;
  username: string;
  isMe: boolean;
  winnersPoint: number;
}
export function PlayerCardSummary({
  winnersPoint,
  username,
  isMe,
  point,
}: PlayerCardSummaryProps) {
  return (
    <div
      className={`${styles.player} ${
        point === winnersPoint ? styles['player--active'] : ''
      } ${isMe ? styles.me : ''}`}
    >
      <h5 className={styles['player__name']}>
        {isMe ? 'You' : username}
        {point === winnersPoint && (
          <Image src="/images/crown.svg" alt="" width={20} height={30} />
        )}
      </h5>
      <Avatar seed={username} height={70} width={70} />
      <div>{point}</div>
    </div>
  );
}
