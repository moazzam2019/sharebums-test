import {
  LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import {
  Button, Tooltip, Carousel, Image
} from 'antd';
import Link from 'next/link';
import { videoDuration } from '@lib/index';
import { IFeed } from 'src/interfaces';
import { ImageFillSvg, VideoFillIcon } from 'src/icons';
import './index.less';

interface IProps {
  feed: IFeed;
}

export function FeedGridCard({ feed }: IProps) {
  const canView = (!feed.isSale && feed.isSubscribed) || (feed.isSale && feed.isBought);
  const images = feed.files && feed.files.filter((f) => f.type === 'feed-photo');
  const videos = feed.files && feed.files.filter((f) => f.type === 'feed-video');
  // const thumbUrl = (canView ? ((feed?.thumbnail?.url) || (feed?.teaser && feed?.teaser?.thumbnails && feed?.teaser?.thumbnails[0]))
  //   : (feed?.thumbnail?.thumbnails && feed?.thumbnail?.thumbnails[0]) || (videos && videos[0] && videos[0]?.thumbnails && videos[0]?.thumbnails[0]))
  //   || '/static/leaf.jpg';

  return (
    <div className="feed-grid-card" key={feed._id}>
      <Link
        href={{ pathname: '/post', query: { id: feed.slug || feed._id } }}
        as={`/post/${feed.slug || feed._id}`}
      >
        <div>
          <div className={canView ? 'card-viewer' : 'card-viewer blured'}>
            {feed.files && feed.files.length ? (
              <>
                {images && images.length > 0 && (
                <Image.PreviewGroup>
                  <Carousel
                    draggable
                    swipe
                    swipeToSlide
                    arrows
                    dots={false}
                    infinite
                  >
                    {images.map((img) => (
                      <Image
                        preview={false}
                        key={img._id}
                        src={canView ? img.url : (img?.thumbnails && img?.thumbnails[0])}
                        fallback="/static/no-image.jpg"
                        title={img.name}
                        width="100%"
                        alt="img"
                      />
                    ))}
                  </Carousel>
                </Image.PreviewGroup>
                )}
                {videos && videos.length > 0 && (
                <Image.PreviewGroup>
                  <Carousel
                    draggable
                    swipe
                    swipeToSlide
                    arrows
                    dots={false}
                    infinite
                  >
                    {videos.map((vid) => (
                      <Image
                        preview={false}
                        key={vid._id}
                        src={vid?.thumbnails}
                        fallback="/static/no-image.jpg"
                        title={vid.name}
                        width="100%"
                        alt="img"
                      />
                    ))}
                  </Carousel>
                </Image.PreviewGroup>
                )}
              </>
            ) : (
              <div className="no-image">
                <Image
                  preview={false}
                  src="/static/leaf.jpg"
                  fallback="/static/leaf.jpg"
                  width="100%"
                  alt="img"
                />
              </div>
            )}
            {!canView && (
            <div className="card-middle">
              {(!feed.isSale && !feed.isSubscribed) && (
              <Button
                className="secondary"
                type="link"
              >
                {canView ? <UnlockOutlined /> : <LockOutlined />}
                {' '}
                Subscribe to unlock
              </Button>
              )}
              {(feed.isSale && !feed.isBought) && (
              <Button
                className="secondary"
                type="link"
              >
                {canView ? <UnlockOutlined /> : <LockOutlined />}
                {' '}
                Unlock for
                {' '}
                {(feed.price || 0).toFixed(2)}
                $
              </Button>
              )}
            </div>
            )}

            <div className="card-bottom">
              {feed.files && feed.files.length > 0 ? (
                <span className="count-media-item">
                  {images.length > 0 && (
                  <>
                    <ImageFillSvg />
                    {' '}
                    {images.length > 1 && images.length}
                  </>
                  )}
                  {videos.length > 0 && (
                  <>
                    <VideoFillIcon />
                    {' '}
                    {videos.length === 1 && videoDuration(videos[0]?.duration)}
                  </>
                  )}
                </span>
              ) : <span className="count-media-item">Aa</span>}
            </div>
          </div>
          <Tooltip title={feed.text}>
            <div className="feed-info">
              {feed.text}
            </div>
          </Tooltip>
        </div>
      </Link>
    </div>
  );
}
