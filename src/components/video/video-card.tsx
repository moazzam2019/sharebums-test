import { PureComponent } from 'react';
import { LockOutlined, UnlockOutlined, CalendarOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import Link from 'next/link';
import { videoDuration } from '@lib/index';
import { IVideo } from 'src/interfaces';
import './video.less';
import { VideoFillIcon } from 'src/icons';

interface IProps {
  video: IVideo;
}

export class VideoCard extends PureComponent<IProps> {
  state = {
    isHovered: false
  };

  render() {
    const { video } = this.props;
    const { isHovered } = this.state;
    const canView = (!video.isSale && video.isSubscribed) || (video.isSale && video.isBought);
    const thumbUrl = (canView ? video?.thumbnail?.url : (video?.thumbnail?.thumbnails && video?.thumbnail?.thumbnails[0])) || (video?.teaser?.thumbnails && video?.teaser?.thumbnails[0]) || (video?.video?.thumbnails && video?.video?.thumbnails[0]) || '/static/no-image.jpg';
    return (
      <Link
        href={{ pathname: '/video', query: { id: video.slug || video._id } }}
        as={`/video/${video.slug || video._id}`}
      >
        <div
          className="vid-card"
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
        >
          {video.isSchedule && (
          <span className="vid-calendar">
            <CalendarOutlined />
          </span>
          )}
          <div className="vid-thumb">
            <div className="card-bg" style={{ backgroundImage: `url(${thumbUrl})`, filter: !canView && !thumbUrl ? 'blur(15px)' : 'blur(0px)' }} />
            <div className="vid-stats">
              <a>
                <VideoFillIcon />
                {' '}
                {videoDuration(video?.video?.duration || 0)}
              </a>
            </div>
            <div className="lock-middle">
              {(!video.isSale && !video.isSubscribed) && (
              <Button
                className="secondary"
                type="link"
              >
                {(canView || isHovered) ? <UnlockOutlined /> : <LockOutlined />}
                {' '}
                Subscribe to unlock
              </Button>
              )}
              {(video.isSale && !video.isBought) && (
              <Button className="secondary" type="link">
                {(canView || isHovered) ? <UnlockOutlined /> : <LockOutlined />}
                {' '}
                Unlock for
                {' '}
                {(video.price || 0).toFixed(2)}
                $
              </Button>
              )}
            </div>
          </div>
          <Tooltip title={video.title}>
            <div className="vid-info">
              {video.title}
            </div>
          </Tooltip>
        </div>
      </Link>
    );
  }
}
