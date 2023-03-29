import { PureComponent } from 'react';
import {
  Form, Button, Input, Row, Col
} from 'antd';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating?: boolean;
}

export class PerformerPaypalForm extends PureComponent<IProps> {
  render() {
    const { onFinish, user, updating } = this.props;
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish.bind(this)}
        validateMessages={validateMessages}
        initialValues={user?.paypalSetting?.value || {
          email: '',
          phoneNumber: ''
        }}
        labelAlign="left"
        className="account-form"
      >
        <Row>
          <Col lg={12} xs={24}>
            <Form.Item
              name="email"
              label="Paypal account email"
              // help="You must upgrade to Business account to receive the payout from Admin"
            >
              <Input />
            </Form.Item>
            <Form.Item className="text-center">
              <Button className="secondary" htmlType="submit" disabled={updating} loading={updating}>
                Submit
              </Button>
            </Form.Item>
          </Col>
          {/* <Col lg={12} xs={24}>
            <Form.Item
              name="phoneNumber"
              label="Paypal Phone Number"
              validateTrigger={['onChange', 'onBlur']}
              rules={[{ required: true },
                {
                  pattern: new RegExp(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/u),
                  message: 'Please enter valid phone number format eg +86 800 555 1234'
                }]}
            >
              <Input />
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    );
  }
}
