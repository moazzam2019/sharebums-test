import React from "react";
import { createRef } from "react";

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

const PersonalInfo: React.FC<Props> = (props) => {
  const formRef = createRef<HTMLFormElement>();
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // const handleGetStates = async (countryCode: string) => {
  //   const { user } = props;
  //   const resp = await utilsService.statesList(countryCode);
  //   setStates(resp.data);
  //   const eState = resp.data.find((s) => s === user?.state);
  //   if (eState) {
  //     formRef.setFieldsValue({ state: eState });
  //   } else {
  //     formRef.setFieldsValue({ state: "", city: "" });
  //   }
  // };

  // const handleGetCities = async (state: string, countryCode: string) => {
  //   const { user } = props;
  //   const resp = await utilsService.citiesList(countryCode, state);
  //   setCities(resp.data);
  //   const eCity = resp.data.find((s) => s === user?.city);
  //   if (eCity) {
  //     formRef.setFieldsValue({ city: eCity });
  //   } else {
  //     formRef.setFieldsValue({ city: "" });
  //   }
  // };
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
          <Col lg={12} md={12} xs={24}>
            <Form.Item
              name="firstName"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "Please input your first name!" },
                {
                  pattern: new RegExp(
                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                  ),
                  message:
                    "First name can not contain number and special character",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Form.Item
              name="lastName"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "Please input your last name!" },
                {
                  pattern: new RegExp(
                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                  ),
                  message:
                    "Last name can not contain number and special character",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Form.Item
              name="email"
              label={
                !user.verifiedEmail && (
                  <span style={{ fontSize: 10 }}>
                    <Popover
                      title="Your email address is not verified"
                      content={
                        <Button
                          type="primary"
                          onClick={() => onVerifyEmail()}
                          disabled={updating || countTime < 60}
                          loading={updating || countTime < 60}
                        >
                          Click here to {countTime < 60 ? "resend" : "send"} the
                          verification link {countTime < 60 && `${countTime}s`}
                        </Button>
                      }
                    >
                      <a className="error-color">Not verified!</a>
                    </Popover>
                  </span>
                )
              }
              rules={[
                { type: "email" },
                { required: true, message: "Please input your email address!" },
              ]}
              hasFeedback
              validateTrigger={["onChange", "onBlur"]}
            >
              <Input disabled={user.googleConnected} />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Form.Item name="country" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                // onChange={(val: string) => handleGetStates(val)}
              >
                {countries.map((c) => (
                  // @ts-ignore
                  <Option value={c.code} label={c.name} key={c.code}>
                    <img alt="country_flag" src={c.flag} width="25px" />{" "}
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} xs={24}>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={24} md={24} xs={24}>
            <Form.Item
              name="dateOfBirth"
              validateTrigger={["onChange", "onBlur"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Select your date of birth",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(currentDate) =>
                  currentDate &&
                  currentDate > moment().subtract(18, "year").endOf("day")
                }
              />
            </Form.Item>
          </Col>
          <div
            style={{
              margin: "20px auto",
              border: "1px solid #cccccc",
              width: "95%",
              textAlign: "center",
            }}
          ></div>
          <Col md={12} xs={24}>
            <Form.Item
              name="password"
              hasFeedback
              rules={[
                {
                  pattern: new RegExp(
                    /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g
                  ),
                  message:
                    "Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character",
                },
              ]}
            >
              <Input.Password placeholder="New password" />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject("Passwords do not match together!");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
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

export default PersonalInfo;
