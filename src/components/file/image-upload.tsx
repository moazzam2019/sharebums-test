import { Upload, message } from "antd";
import { LoadingOutlined, CameraOutlined } from "@ant-design/icons";
import { PureComponent } from "react";
import { getGlobalConfig } from "@services/config";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file, uploadImmediately = true) {
  const config = getGlobalConfig();
  const isLt5M =
    file.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
  if (!isLt5M) {
    message.error(
      `Image is too large please provide an image ${
        config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5
      }MB or below`
    );
  }
  return uploadImmediately;
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  accept?: string;
  imageUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  onFileReaded?: Function;
  options?: any;
  uploadImmediately?: boolean;
}

export class ImageUpload extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    imageUrl: "",
  };

  componentDidMount() {
    const { imageUrl } = this.props;
    this.setState({ imageUrl });
  }

  handleChange = (info: any) => {
    const { onFileReaded, onUploaded } = this.props;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      onFileReaded && onFileReaded(info.file.originFileObj);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: false,
        });
        onUploaded &&
          onUploaded({
            response: info.file.response,
            base64: imageUrl,
          });
      });
    }
  };

  render() {
    const {
      options = {},
      accept,
      headers,
      uploadUrl,
      uploadImmediately,
    } = this.props;
    const { imageUrl, loading } = this.state;
    const uploadButton = (
      <div>{loading ? <LoadingOutlined /> : <CameraOutlined />}</div>
    );
    return (
      <Upload
        accept={accept || "image/*"}
        name={options.fieldName || "file"}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={(file) =>
          beforeUpload(
            file,
            typeof uploadImmediately === "boolean" ? uploadImmediately : true
          )
        }
        onChange={this.handleChange}
        headers={headers}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="file" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}
