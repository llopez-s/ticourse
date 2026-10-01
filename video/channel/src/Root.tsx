import { Still } from 'remotion';
import { AVATAR, Avatar } from './Avatar';
import { Banner } from './Banner';
import { BANNER } from './skyline';

/** YouTube Studio → Personalización → Imagen de marca. */
export function ChannelRoot() {
  return (
    <>
      <Still id="ChannelAvatar" component={Avatar} width={AVATAR} height={AVATAR} />
      <Still id="ChannelBanner" component={Banner} width={BANNER.width} height={BANNER.height} />
    </>
  );
}
