import { postLogout } from '@/redux/features/auth/reducers';
import { getPlayer } from '@/redux/features/player/reducers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getToken } from '@/redux/utils/token';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Avatar from '../avatar';

import styles from './index.module.scss';

export default function Header() {
  const dispatch = useAppDispatch();

  const player = useAppSelector((state) => state.playerReducer.player);
  const router = useRouter();

  const logout = () => {
    dispatch(postLogout()).then(() => {
      router.push('/login');
    });
  };

  useEffect(() => {
    if (getToken()) {
      dispatch(getPlayer());
    }
  }, [dispatch]);

  return (
    <div className={styles.header}>
      {player && (
        <div className={styles['header__content']}>
          <div data-test="username">{player.username}</div>
          <Avatar seed={player.username} />
          <button data-test="logout" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
