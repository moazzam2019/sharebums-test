import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PureComponent } from 'react';
import { getGlobalConfig } from '@services/config';
import { UploadDoneSvg, EditPhotoSvg } from 'src/icons';

interface IState {
  fileName: string;
}

interface IProps {
  accept?: string;
  imageUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  onFileReaded?: Function;
  options?: any;
  yourId?: boolean;
  holdingYourId?: boolean;
}

export class ImageUploadModelRegister extends PureComponent<IProps, IState> {
  state = {
    fileName: ''
  };

  beforeUpload(file) {
    const { onFileReaded } = this.props;
    const config = getGlobalConfig();
    const isLt5M = file.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 20);
    if (!isLt5M) {
      message.error(`Image is too large please provide an image ${config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 20}MB or below`);
      return false;
    }
    this.setState({ fileName: file.name });
    onFileReaded && onFileReaded(file);
    return true;
  }

  render() {
    const {
      options = {}, accept, headers, uploadUrl, yourId, holdingYourId
    } = this.props;
    const { fileName } = this.state;
    const uploadButton = (
      <div>
        {fileName && fileName ? <EditPhotoSvg /> : <PlusOutlined />}
      </div>
    );

    return (
      <Upload
        customRequest={() => false}
        accept={accept || 'image/*'}
        name={options.fieldName || 'file'}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={(file) => this.beforeUpload(file)}
        headers={headers}
      >
        <div className="file-name">
          {fileName && <UploadDoneSvg />}
          {yourId && ((fileName && <p>{fileName}</p>) || <p>Add photo of your ID</p>)}
          {holdingYourId && ((fileName && <p>{fileName}</p>) || <p>Add photo of you holding your ID</p>)}
        </div>
        {uploadButton}
      </Upload>
    );
  }
}
