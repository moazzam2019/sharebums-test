import React from "react";
import { createRef } from "react";
import { AvatarUpload } from "@components/user/avatar-upload";

import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Upload,
  Progress,
  message,
  Checkbox,
  Popover,
  Modal,
} from "antd";
import { IPerformer, ICountry, IBody } from "src/interfaces";
import moment from "moment";
import { useState } from "react";
import { utilsService } from "src/services";

interface Props {
  onFinish: Function;
  onVerifyEmail: Function;
  countTime: number;
  user: IPerformer;
  updating: boolean;
  options?: {
    uploadHeaders?: any;
    avatarUploadUrl?: string;
    onAvatarUploaded?: Function;
    coverUploadUrl?: string;
    onCoverUploaded?: Function;
    beforeUpload?: Function;
    videoUploadUrl?: string;
    onVideoUploaded?: Function;
    uploadPercentage?: number;
  };
  countries: ICountry[];
  bodyInfo: IBody;
}

const Appearance: React.FC<Props> = (props) => {
  const {
    onFinish,
    user,
    updating,
    countries,
    options,
    bodyInfo,
    onVerifyEmail,
    countTime = 60,
  } = props;
  const {
    uploadHeaders,
    avatarUploadUrl,
    onAvatarUploaded,
    coverUploadUrl,
    onCoverUploaded,
    videoUploadUrl,
  } = options;
  const { TextArea } = Input;

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const validateMessages = {
    required: "This field is required!",
    types: {
      email: "Not a validate email!",
      number: "Not a validate number!",
    },
    number: {
      range: "Must be between ${min} and ${max}",
    },
  };

  console.log(props);
  return (
    <>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish.bind(this)}
        validateMessages={validateMessages}
        initialValues={{
          ...user,
          dateOfBirth: (user.dateOfBirth && moment(user.dateOfBirth)) || "",
        }}
        scrollToFirstError
        className="account-form"
      >
        <Row>
          <Col lg={24} md={24} xs={24}>
            <div className="avatar-upload">
              <AvatarUpload
                user={user}
                headers={uploadHeaders}
                uploadUrl={avatarUploadUrl}
                onUploaded={onAvatarUploaded}
                image={user?.avatar}
              />
            </div>
          </Col>
          {/* <Col lg={12} md={12} xs={24}>
            <Form.Item label="Intro Video">
              <Upload
                accept={"video/*"}
                name="welcome-video"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={videoUploadUrl}
                headers={uploadHeaders}
                beforeUpload={(file) => this.beforeUploadVideo(file)}
                onChange={this.handleVideoChange.bind(this)}
              >
                <UploadOutlined />
              </Upload>
              <div
                className="ant-form-item-explain"
                style={{ textAlign: "left" }}
              >
                {((previewVideoUrl || previewVideoName) && (
                  <a
                    aria-hidden
                    onClick={() => this.setState({ isShowPreview: true })}
                  >
                    {previewVideoName ||
                      previewVideoUrl ||
                      "Click here to preview"}
                  </a>
                )) || (
                  <a>
                    Intro video is{" "}
                    {getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_TEASER || 200}
                    MB or below
                  </a>
                )}
              </div>
              {uploadVideoPercentage ? (
                <Progress percent={Math.round(uploadVideoPercentage)} />
              ) : null}
            </Form.Item>
            <Form.Item name="activateWelcomeVideo" valuePropName="checked">
              <Checkbox>Activate intro video</Checkbox>
            </Form.Item>
          </Col> */}
          <Col lg={12} md={12} xs={24}>
            <Form.Item
              name="name"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "Please input your display name!" },
                {
                  pattern: new RegExp(/^(?=.*\S).+$/g),
                  message: "Display name can not contain only whitespace",
                },
                {
                  min: 3,
                  message: "Display name must containt at least 3 characters",
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Form.Item
              name="username"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  pattern: new RegExp(/^[a-z0-9]+$/g),
                  message: "Username must contain lowercase alphanumerics only",
                },
                {
                  min: 3,
                  message: "Username must containt at least 3 characters",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="user1, john99,..." />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="bio"
              rules={[
                {
                  required: true,
                  message: "Please enter your bio!",
                },
              ]}
            >
              <TextArea
                rows={5}
                placeholder="Tell people something about you..."
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
          <Button
            className="primary"
            type="primary"
            htmlType="submit"
            loading={updating}
            disabled={updating}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Appearance;
