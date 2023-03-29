import { PureComponent, createRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Progress,
  Row,
  Col
} from 'antd';
import { IProduct } from 'src/interfaces';
import { FileAddOutlined, CameraOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { getGlobalConfig } from '@services/config';

interface IProps {
  product?: IProduct;
  submit?: Function;
  beforeUpload?: Function;
  uploading?: boolean;
  uploadPercentage?: number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export class FormProduct extends PureComponent<IProps> {
  state = {
    previewImageProduct: null,
    isDigitalProduct: false,
    digitalFileAdded: false
  };

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    const { product } = this.props;
    if (product) {
      this.setState({
        isDigitalProduct: product.type === 'digital',
        previewImageProduct: product?.image || '/static/no-image.jpg',
        digitalFileAdded: !!product.digitalFileUrl
      });
    }
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
    if (field === 'type') {
      this.setState({ isDigitalProduct: val === 'digital' });
    }
  }

  beforeUploadThumb(file) {
    const { beforeUpload } = this.props;
    const config = getGlobalConfig();
    const reader = new FileReader();
    reader.addEventListener('load', () => this.setState({ previewImageProduct: reader.result }));
    reader.readAsDataURL(file);
    const isValid = file.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_FILE || 100);
    if (!isValid) {
      message.error(`File is too large please provide an file ${config.NEXT_PUBLIC_MAX_SIZE_FILE || 100}MB or below`);
      return false;
    }
    beforeUpload && beforeUpload(file, 'image');
    return isValid;
  }

  beforeUploadDigitalFile(file) {
    const { beforeUpload } = this.props;
    const config = getGlobalConfig();
    const isValid = file.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_FILE || 100);
    if (!isValid) {
      message.error(`File is too large please provide an file ${config.NEXT_PUBLIC_MAX_SIZE_FILE || 100}MB or below`);
      return false;
    }
    this.setState({ digitalFileAdded: true });
    beforeUpload && beforeUpload(file, 'digitalFile');
    return isValid;
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      product, submit, uploading, uploadPercentage
    } = this.props;
    const {
      previewImageProduct, isDigitalProduct, digitalFileAdded
    } = this.state;
    const haveProduct = !!product;
    return (
      <Form
        {...layout}
        onFinish={submit.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields')}
        name="form-upload"
        ref={this.formRef}
        validateMessages={validateMessages}
        initialValues={
          product || ({
            name: '',
            price: 1,
            description: '',
            status: 'active',
            performerId: '',
            stock: 1,
            type: 'physical'
          })
        }
        className="account-form"
        scrollToFirstError
      >
        <Row>
          <Col md={12} xs={24}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input name of product!' }]}
              label="Name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select type!' }]}
            >
              <Select onChange={(val) => this.setFormVal('type', val)}>
                <Select.Option key="physical" value="physical">
                  Physical
                </Select.Option>
                <Select.Option key="digital" value="digital">
                  Digital
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Price is required!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          {!isDigitalProduct && (
          <Col md={12} xs={12}>
            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Stock is required!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          )}
          <Col md={!isDigitalProduct ? 24 : 12} xs={!isDigitalProduct ? 24 : 12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Select.Option key="active" value="active">
                  Active
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  Inactive
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item label="Image">
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={this.beforeUploadThumb.bind(this)}
                customRequest={() => false}
              >
                {previewImageProduct && (
                  <img
                    src={previewImageProduct}
                    alt="file"
                    style={{ width: '100%' }}
                  />
                )}
                <CameraOutlined />
              </Upload>
            </Form.Item>
          </Col>
          {isDigitalProduct && (
          <Col md={12} xs={12}>
            <Form.Item label="Digital file">
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={this.beforeUploadDigitalFile.bind(this)}
                customRequest={() => false}
              >
                {digitalFileAdded && <img src="/static/file-checked.jpg" alt="check" />}
                <FileAddOutlined />
              </Upload>
              {product?.digitalFileUrl && <div className="ant-form-item-explain" style={{ textAlign: 'left' }}><a download target="_blank" href={product?.digitalFileUrl} rel="noreferrer">Click to download</a></div>}
            </Form.Item>
          </Col>
          )}
        </Row>
        {uploadPercentage > 0 ? (
          <Progress percent={Math.round(uploadPercentage)} />
        ) : null}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button
            className="primary"
            type="primary"
            htmlType="submit"
            loading={uploading}
            disabled={uploading}
          >
            {haveProduct ? 'Update' : 'Upload'}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
