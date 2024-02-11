import Image from 'next/image';
import { AvatarGenerator } from 'random-avatar-generator';
import { useMemo } from 'react';

export default function Avatar({
  seed,
  width = 30,
  height = 30,
}: {
  seed: string;
  width?: number;
  height?: number;
}) {
  const avatar = useMemo(() => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar('cool' + seed);
  }, [seed]);

  return <Image src={avatar} alt="" width={width} height={height} />;
}
