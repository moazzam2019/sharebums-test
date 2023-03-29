import { PureComponent } from 'react';
import {
  InputNumber, Button, Avatar
} from 'antd';
import { TickIcon } from 'src/icons';
import { IPerformer } from '@interfaces/index';
import './performer.less';

interface IProps {
  performer: IPerformer;
  onFinish(price: any): Function;
  submiting: boolean;
}

export class TipPerformerForm extends PureComponent<IProps> {
  state = {
    price: 10
  };

  onChangeValue(price) {
    this.setState({ price });
  }

  render() {
    const {
      onFinish, submiting = false, performer
    } = this.props;
    const { price } = this.state;
    return (
      <div className="confirm-purchase-form confirm-purchase-custom">
        <h2>Send tip</h2>
        <Avatar src={performer?.avatar || '/static/no-avatar.png'} />
        <div className="p-name">
          {performer?.name || 'N/A'}
          {' '}
          {performer?.verifiedAccount && <TickIcon className="primary-color" />}
        </div>
        <div className="right-col">
          <div className="tip-grps">
            <Button type={price === 10 ? 'primary' : 'default'} onClick={() => this.onChangeValue(10)}>
              $10
            </Button>
            <Button type={price === 50 ? 'primary' : 'default'} onClick={() => this.onChangeValue(50)}>
              $50
            </Button>
            <Button type={price === 100 ? 'primary' : 'default'} onClick={() => this.onChangeValue(100)}>
              $100
            </Button>
            <Button type={price === 250 ? 'primary' : 'default'} onClick={() => this.onChangeValue(250)}>
              $250
            </Button>
            <Button type={price === 500 ? 'primary' : 'default'} onClick={() => this.onChangeValue(500)}>
              $500
            </Button>
            <Button type={price === 1000 ? 'primary' : 'default'} onClick={() => this.onChangeValue(1000)}>
              $1000
            </Button>
          </div>
          <div className="tip-input">
            <p>Enter your tip amount in $</p>
            <InputNumber min={1} onChange={this.onChangeValue.bind(this)} value={price} />
          </div>
          <Button
            className="primary"
            disabled={submiting}
            loading={submiting}
            onClick={() => onFinish(price)}
          >
            SEND TIP
          </Button>
        </div>

      </div>
    );
  }
}
