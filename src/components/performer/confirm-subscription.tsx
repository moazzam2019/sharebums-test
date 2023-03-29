/* eslint-disable no-nested-ternary */
import { PureComponent } from 'react';
import {
  Button, Avatar
} from 'antd';
import { IPerformer } from 'src/interfaces';
import {
  CheckSquareOutlined
} from '@ant-design/icons';
import { DoneRoundIcon, TickIcon } from 'src/icons';
import './performer.less';

interface IProps {
  type: string;
  performer: IPerformer;
  onFinish: Function;
  submiting: boolean;
}

export class ConfirmSubscriptionPerformerForm extends PureComponent<IProps> {
  render() {
    const {
      onFinish, submiting = false, performer, type
    } = this.props;
    return (
      <div className="confirm-purchase-form">
        <div className="left-col">
          <Avatar src={performer?.avatar || '/static/no-avatar.png'} />
          <div className="p-name">
            {performer?.name || 'N/A'}
            {' '}
            {performer?.verifiedAccount && <TickIcon className="primary-color" />}
          </div>
        </div>
        <div className="right-col">
          <h2>
            Subscribe
            {' '}
            <span className="username">{`@${performer?.username}` || 'the model'}</span>
          </h2>
          {type === 'monthly' && (
          <h3>
            <span className="price">{(performer?.monthlyPrice || 0).toFixed(2)}</span>
            {' '}
            USD/month
          </h3>
          )}
          {type === 'yearly' && (
          <h3>
            <span className="price">{(performer?.yearlyPrice || 0).toFixed(2)}</span>
            {' '}
            USD/year
          </h3>
          )}
          {type === 'free' && (
          <h3>
            <span className="price">FREE</span>
            {' '}
            for
            {' '}
            {performer?.durationFreeSubscriptionDays}
            {' '}
            day
            {performer?.durationFreeSubscriptionDays > 1 ? 's' : ''}
          </h3>
          )}
          <ul className="check-list">
            <li>
              <DoneRoundIcon />
              {' '}
              Full access to this model&apos;s exclusive content
            </li>
            <li>
              <DoneRoundIcon />

              {' '}
              Direct message with this model
            </li>
            <li>
              <DoneRoundIcon />

              {' '}
              Requested personalised Pay Per View content
            </li>
            <li>
              <DoneRoundIcon />

              {' '}
              Cancel your subscription at any time
            </li>
          </ul>
          <Button
            className="primary"
            disabled={submiting}
            loading={submiting}
            onClick={() => onFinish()}
          >
            SUBSCRIBE
          </Button>
          <p className="sub-text">
            Clicking &quot;Subscribe&quot; will take you to the payment
            screen to finalize your subscription

          </p>
        </div>

      </div>
    );
  }
}
