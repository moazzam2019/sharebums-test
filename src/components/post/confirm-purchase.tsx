import { PureComponent } from 'react';
import {
  Button, Avatar
} from 'antd';
import { IFeed } from '@interfaces/index';
import { TickIcon } from 'src/icons';
import './index.less';

interface IProps {
  feed: IFeed;
  onFinish: Function;
  submiting: boolean;
}

export class PurchaseFeedForm extends PureComponent<IProps> {
  render() {
    const {
      onFinish, submiting = false, feed
    } = this.props;

    return (
      <div className="confirm-purchase-form confirm-purchase-custom">
        <Avatar src={feed?.performer?.avatar || '/static/no-avatar.png'} />
        <div className="p-name">
          {feed?.performer?.name || 'N/A'}
          {' '}
          {feed?.performer?.verifiedAccount && <TickIcon className="primary-color" />}
        </div>
        <p className="description">
          {feed.text}
        </p>
        <Button
          className="primary"
          disabled={submiting}
          loading={submiting}
          onClick={() => onFinish()}
        >
          UNLOCK THIS POST FOR
          {' '}
          {(feed.price || 0).toFixed(2)}
          $
        </Button>
      </div>
    );
  }
}
