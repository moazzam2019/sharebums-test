import { useState } from 'react';
import { Tooltip, Button } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { IGallery } from 'src/interfaces';
import Link from 'next/link';
import './gallery.less';
import { ImageFillSvg } from 'src/icons';

interface GalleryCardIProps {
  gallery: IGallery;
}

const GalleryCard = ({ gallery }: GalleryCardIProps) => {
  const [isHovered, setHover] = useState(false);
  const canView = (!gallery.isSale && gallery.isSubscribed) || (gallery.isSale && gallery.isBought);
  const thumbUrl = (!canView
    ? gallery?.coverPhoto?.thumbnails && gallery?.coverPhoto?.thumbnails[0]
    : gallery?.coverPhoto?.url) || '/static/no-image.jpg';
  return (
    <Link
      href={{
        pathname: '/gallery',
        query: { id: gallery?.slug || gallery?._id }
      }}
      as={`/gallery/${gallery?.slug || gallery?._id}`}
    >
      <div
        className="gallery-card"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="gallery-thumb">
          <div
            className="card-bg"
            style={{
              backgroundImage: `url(${thumbUrl})`,
              filter: canView && thumbUrl ? 'blur(0px)' : 'blur(15px)'
            }}
          />
          <div className="gallery-stats">
            <p>
              <ImageFillSvg />
              <span>
                {gallery?.numOfItems || 0}
              </span>
            </p>
          </div>
          <div className="lock-middle">
            {(!gallery.isSale && !gallery.isSubscribed) && (
              <Button
                className="secondary"
                type="link"
              >
                {(canView || isHovered) ? <UnlockOutlined /> : <LockOutlined />}
                {' '}
                Subscribe to unlock
              </Button>
            )}
            {(gallery.isSale && !gallery.isBought) && (
              <Button className="secondary" type="link">
                {(canView || isHovered) ? <UnlockOutlined /> : <LockOutlined />}
                {' '}
                Unlock for
                {' '}
                {(gallery.price || 0).toFixed(2)}
                $
              </Button>
            )}
          </div>
        </div>
        <Tooltip title={gallery?.title}>
          <div className="gallery-info">
            {gallery.title}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
};
export default GalleryCard;
