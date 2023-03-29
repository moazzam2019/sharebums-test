import { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { IVideo } from 'src/interfaces/video';
import { VideoCard } from '.';

interface IProps {
  videos: any;
}

export class PerformerListVideo extends PureComponent<IProps> {
  render() {
    const { videos } = this.props;
    return (
      <Row>
        {videos.length > 0
          && videos.map((video: IVideo) => (
            <Col style={{ padding: 0 }} xs={24} sm={12} md={8} lg={8} key={video._id}>
              <VideoCard video={video} />
            </Col>
          ))}
      </Row>
    );
  }
}
