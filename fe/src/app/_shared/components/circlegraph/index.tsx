import { PlayersState } from '@/app/_shared/models/game';
import { Player } from '@/redux/features/player/models';
import { useEffect, useRef } from 'react';

import { PlayerCard } from '../player-card';

import styles from './index.module.scss';

interface Props {
  player: Player;
  playersState: PlayersState;
  turnPlayerId?: string;
}
export default function Circlegraph({
  player,
  playersState,
  turnPlayerId,
}: Props) {
  const graph = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Process circlegraph player positions
    const ciclegraph = graph.current;
    if (ciclegraph) {
      const playerElements = ciclegraph.childNodes;
      let angle = 90;
      let slice = 360 / playerElements.length;

      for (let i = 0; i < playerElements.length; i++) {
        let player = playerElements[i] as HTMLElement;
        player.style.transform = [
          `rotate(${angle}deg)`,
          `translate(${ciclegraph.clientWidth / 2}px)`,
          `rotate(-${angle}deg)`,
        ].join(' ');
        angle += slice;
      }
    }
  }, [playersState, player]);

  return (
    <div className={styles.ciclegraph} ref={graph}>
      <PlayerCard
        isMe={true}
        player={{
          playerId: player.id,
          playerUsername: player.username,
          cardsCount: playersState[player.id].cards?.length || 0,
          cards: playersState[player.id].cards,
        }}
        turnPlayerId={turnPlayerId}
      />
      {Object.values(playersState)
        .filter((p) => p.playerId !== player.id)
        .map((player) => (
          <PlayerCard
            key={player.playerId}
            player={player}
            turnPlayerId={turnPlayerId}
          />
        ))}
    </div>
  );
}
