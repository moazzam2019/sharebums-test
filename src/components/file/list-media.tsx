import { PureComponent } from 'react';
import { DeleteOutlined, PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
  Progress, Button, Upload, Tooltip, Image, Modal
} from 'antd';
import { VideoPlayer } from '@components/common';
import '../post/index.less';

interface IProps {
  remove: Function;
  files: any[];
  onAddMore: Function;
  uploading: boolean;
  type?: string;
}
export default class UploadList extends PureComponent<IProps> {
  state = {
    isShowPreview: false,
    previewUrl: ''
  }

  beforeUpload(file, fileList) {
    const { onAddMore: handleAddMore } = this.props;
    handleAddMore(file, fileList);
  }

  render() {
    const {
      files, remove: handleRemove, uploading, type
    } = this.props;
    const { isShowPreview, previewUrl } = this.state;
    return (
      <div className="f-upload-list">
        {files && files.map((file) => (
          <div className="f-upload-item" key={file._id || file.uid}>
            <div className="f-upload-thumb">
              {/* eslint-disable-next-line no-nested-ternary */}
              {(file.type.includes('feed-photo') || file.type.includes('image'))
                ? <Image placeholder alt="img" src={file.url ? file.url : file.thumbnail} width="100%" />
                : file.type.includes('video') ? (
                  <span className="f-thumb-vid" aria-hidden onClick={() => this.setState({ isShowPreview: true, previewUrl: file?.url })}>
                    <PlayCircleOutlined />
                  </span>
                ) : <img alt="img" src="/static/no-image.jpg" width="100%" />}
            </div>
            <div className="f-upload-name">
              <Tooltip title={file.name}>{file.name}</Tooltip>
            </div>
            <div className="f-upload-size">
              {(file.size / (1024 * 1024)).toFixed(2)}
              {' '}
              MB
            </div>
            {file.status !== 'uploading'
              && (
              <span className="f-remove">
                <Button type="primary" onClick={handleRemove.bind(this, file)}>
                  <DeleteOutlined />
                </Button>
              </span>
              )}
            {file.percent && <Progress percent={Math.round(file.percent)} />}
          </div>
        ))}
        {(type === 'photo' || (type === 'video' && !files.length)) && (
        <div className="add-more">
          <Upload
            customRequest={() => true}
            accept={type === 'video' ? 'video/*' : 'image/*'}
            beforeUpload={this.beforeUpload.bind(this)}
            multiple={type === 'photo'}
            showUploadList={false}
            disabled={uploading}
            listType="picture"
          >
            <PlusOutlined />
            {' '}
            Add
            {' '}
            {/* eslint-disable-next-line no-nested-ternary */}
            {type === 'photo' ? 'photos' : type === 'video' ? 'video' : 'files'}
          </Upload>
        </div>
        )}
        <Modal
          width={767}
          footer={null}
          onOk={() => this.setState({ isShowPreview: false })}
          onCancel={() => this.setState({ isShowPreview: false })}
          visible={isShowPreview}
          destroyOnClose
        >
          <VideoPlayer
            {...{
              autoplay: true,
              controls: true,
              playsinline: true,
              fluid: true,
              sources: [
                {
                  src: previewUrl,
                  type: 'video/mp4'
                }
              ]
            }}
          />
        </Modal>
      </div>
    );
  }
}
