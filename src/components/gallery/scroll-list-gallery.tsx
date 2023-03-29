import { PureComponent } from 'react';
import {
  Spin, Row, Col, Alert
} from 'antd';
import { IGallery } from '@interfaces/gallery';
import InfiniteScroll from 'react-infinite-scroll-component';
import GalleryCard from './gallery-card';

interface IProps {
  items: IGallery[];
  canLoadmore: boolean;
  loadMore(): Function;
  loading: boolean;
  notFoundText?: string;
}

export class ScrollListGallery extends PureComponent<IProps> {
  render() {
    const {
      items = [], loadMore, canLoadmore = false, loading = false, notFoundText
    } = this.props;
    return (
      <>
        <InfiniteScroll
          dataLength={items.length}
          hasMore={canLoadmore}
          loader={null}
          next={loadMore}
          endMessage={null}
          scrollThreshold={0.9}
        >
          <Row>
            {items.length > 0
              && items.map((gallery: IGallery) => (
                <Col
                  style={{ padding: 0 }}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  key={gallery._id}
                >
                  <GalleryCard gallery={gallery} />
                </Col>
              ))}
          </Row>
        </InfiniteScroll>
        {!loading && !items.length && (
        <div className="main-container custom">
          <Alert className="text-center" type="info" message={notFoundText || 'No gallery was found'} />
        </div>
        )}
        {loading && <div className="text-center"><Spin /></div>}
      </>
    );
  }
}
