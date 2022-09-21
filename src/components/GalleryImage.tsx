import { createEffect, createSignal } from 'solid-js';
import styles from '../styles/GalleryImage.module.css';

interface GalleryImageProps {
  src: string;
  alt: string;
}

const GalleryImage = ({ src, alt }: GalleryImageProps) => {
  const [isFullscreen, setIsFullscreen] = createSignal<boolean>(false);

  const open = () => {
    if (isFullscreen()) return;

    setIsFullscreen(true);
    document.body.classList.add('prevent-scroll');
  };

  const close = () => {
    if (!isFullscreen()) return;

    setIsFullscreen(false);
    document.body.classList.remove('prevent-scroll');
  };

  return (
    <>
      <div class={`${styles['img-wrapper']} ${isFullscreen() ? styles.open : ''}`} onClick={open}>
        <img class={`${styles['gallery-img']} ${isFullscreen() ? styles.open : ''}`} src={src} alt={alt} />
      </div>
      <div class={`${styles.shadow} ${isFullscreen() ? styles.open : ''}`} onClick={close} />
      <button class={`${styles['close-button']} ${isFullscreen() ? styles.open : ''}`} onClick={close}>
        Zamknij
      </button>
    </>
  );
};

export default GalleryImage;
