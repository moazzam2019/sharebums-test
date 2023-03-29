/* eslint-disable prefer-promise-reject-errors */
import {
  Row, Col, Button, Layout, Form, Input, Select, message, DatePicker, Divider
} from 'antd';
import { TwitterOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { PureComponent } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { connect } from 'react-redux';
import { registerPerformer, loginSocial } from '@redux/auth/actions';
import { ISettings, IUIConfig, ICountry } from 'src/interfaces';
import moment from 'moment';
import { authService, utilsService } from 'src/services';
import './index.less';
import GoogleLoginButton from '@components/auth/google-login-button';
import { ImageUploadModelRegister } from '@components/file/image-upload-model-register';

const { Option } = Select;

interface IProps {
  loginSocial: Function;
  registerPerformerData: any;
  registerPerformer: Function;
  ui: IUIConfig;
  settings: ISettings;
  countries: ICountry[];
}

class RegisterPerformer extends PureComponent<IProps> {
  static layout = 'blank';

  static authenticate = false;

  idVerificationFile = null;

  documentVerificationFile = null;

  currentFormValues = {} as any;

  static async getInitialProps() {
    const [countries] = await Promise.all([utilsService.countriesList()]);
    return {
      countries: countries?.data || []
    };
  }

  state = {
    isLoading: false,
    step: 1,
    idVerification: null,
    documentVerification: null
  };

  componentDidUpdate(prevProps) {
    const { registerPerformerData, ui } = this.props;
    if (
      !prevProps?.registerPerformerData?.success
      && prevProps?.registerPerformerData?.success !== registerPerformerData?.success
    ) {
      message.success(
        <div>
          <h4>{`Thank you for applying to be an ${ui?.siteName || 'Fanso'} creator!`}</h4>
          <p>
            {registerPerformerData?.data?.message
              || 'Your application will be processed withing 24 to 48 hours, most times sooner. You will get an email notification sent to your email address with the status update.'}
          </p>
        </div>,
        15
      );
      Router.push('/');
    }
  }

  onFileReaded = (file: File, type: string) => {
    if (file && type === 'idFile') {
      this.idVerificationFile = file;
      this.setState({ idVerification: file });
    }
    if (file && type === 'documentFile') {
      this.documentVerificationFile = file;
      this.setState({ documentVerification: file });
    }
  };

  async onGoogleLogin(resp: any) {
    if (!resp?.credential) {
      return;
    }
    const { loginSocial: handleLogin } = this.props;
    const payload = { tokenId: resp.credential, role: 'performer' };
    try {
      await this.setState({ isLoading: true });
      const response = await (await authService.loginGoogle(payload)).data;
      response.token && handleLogin({ token: response.token });
    } catch (e) {
      const error = await e;
      message.error(error && error.message ? error.message : 'Google login authenticated fail');
    } finally {
      this.setState({ isLoading: false });
    }
  }

  register = (values: any) => {
    const data = values;
    const { registerPerformer: registerPerformerHandler } = this.props;
    if (!this.idVerificationFile || !this.documentVerificationFile) {
      return message.error('ID documents are required!');
    }
    data.idVerificationFile = this.idVerificationFile;
    data.documentVerificationFile = this.documentVerificationFile;
    return registerPerformerHandler(data);
  };

  handleNextStep = (values) => {
    const { step } = this.state;
    this.currentFormValues = values;
    if (step === 1) {
      this.setState({ step: step + 1 });
    } else if (step === 2) {
      this.register(this.currentFormValues);
    }
  }

  handlePrevStep = () => {
    const { step } = this.state;
    if (step === 1) {
      Router.back();
    } else if (step === 2) {
      this.setState({ step: 1 });
    }
    this.setState({ step: step - 1 }, () => {
      if (step <= 1) {
        this.setState({ step: 1 });
      }
    });
  }

  async loginTwitter() {
    try {
      await this.setState({ isLoading: true });
      const resp = await (await authService.loginTwitter()).data;
      if (resp && resp.url) {
        authService.setTwitterToken(
          { oauthToken: resp.oauthToken, oauthTokenSecret: resp.oauthTokenSecret },
          'performer'
        );
        window.location.href = resp.url;
      }
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Something went wrong, please try again later');
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const {
      registerPerformerData = { requesting: false }, ui, settings, countries
    } = this.props;
    const {
      isLoading, step, idVerification, documentVerification
    } = this.state;

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Model Sign Up
          </title>
        </Head>
        <div className="background-model-register">
          <div className="main-container">
            <div className="login-box register-box">
              <div className="wrapper">
                <div className="progress" style={{ width: `${step === 2 && '100%'}` }} />
                <div className="top-title text-center">
                  <span className="title">Become a model</span>
                </div>
                <Form
                  name="member_register"
                  initialValues={{
                    gender: 'female',
                    country: 'US',
                    dateOfBirth: ''
                  }}
                  onFinish={this.handleNextStep}
                  scrollToFirstError
                >
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row>
                        <div className={`step-one ${step === 1 && 'enable'}`}>
                          <Col span={24}>
                            <Form.Item
                              name="firstName"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                { required: true, message: 'Please input your name!' },
                                {
                                  pattern: new RegExp(
                                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                                  ),
                                  message: 'First name can not contain number and special character'
                                }
                              ]}
                            >
                              <Input placeholder="First name (only for verifying purpose) " />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="lastName"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                { required: true, message: 'Please input your name!' },
                                {
                                  pattern: new RegExp(
                                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                                  ),
                                  message: 'Last name can not contain number and special character'
                                }
                              ]}
                            >
                              <Input placeholder="Last name (only for verifying purpose)" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="name"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                { required: true, message: 'Please input your display name!' },
                                {
                                  pattern: new RegExp(/^(?=.*\S).+$/g),
                                  message: 'Display name can not contain only whitespace'
                                },
                                {
                                  min: 3,
                                  message: 'Display name must containt at least 3 characters'
                                }
                              ]}
                            >
                              <Input placeholder="Display (the name your fans will see)" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="username"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                { required: true, message: 'Please input your username!' },
                                {
                                  pattern: new RegExp(/^[a-z0-9]+$/g),
                                  message: 'Username must contain only lowercase alphanumerics only!'
                                },
                                { min: 3, message: 'username must containt at least 3 characters' }
                              ]}
                            >
                              <Input placeholder="Username (username is your unique handle)" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="email"
                              validateTrigger={['onChange', 'onBlur']}
                              hasFeedback
                              rules={[
                                {
                                  type: 'email',
                                  message: 'The input is not valid E-mail!'
                                },
                                {
                                  required: true,
                                  message: 'Please input your E-mail!'
                                }
                              ]}
                            >
                              <Input placeholder="Email address" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="dateOfBirth"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Select your date of birth'
                                }
                              ]}
                            >
                              <DatePicker
                                placeholder="Date of Birth"
                                disabledDate={(currentDate) => currentDate && currentDate > moment().subtract(18, 'year').endOf('day')}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item name="country" rules={[{ required: true }]}>
                              <Select showSearch optionFilterProp="label">
                                {countries.map((c) => (
                                  <Option value={c.code} key={c.code} label={c.name}>
                                    <img alt="country_flag" src={c.flag} width="25px" />
                                    {' '}
                                    {c.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="gender"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[{ required: true, message: 'Please select your gender' }]}
                            >
                              <Select>
                                <Option value="male" key="male">
                                  Male
                                </Option>
                                <Option value="female" key="female">
                                  Female
                                </Option>
                                <Option value="transgender" key="trans">
                                  Trans
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="password"
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  pattern: new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g),
                                  message:
                                    'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                                },
                                { required: true, message: 'Please input your password!' }
                              ]}
                            >
                              <Input.Password placeholder="Password" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="confirm"
                              dependencies={['password']}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter confirm password!'
                                },
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject('Passwords do not match together!');
                                  }
                                })
                              ]}
                            >
                              <Input type="password" placeholder="Confirm password" />
                            </Form.Item>
                          </Col>
                        </div>
                        <div className={`step-two ${step === 2 && 'enable'}`}>
                          <Col span={24} className="upload-wrap">
                            <h1 className="title">* Rules, please read for fast approval</h1>
                            <ul className="upload-subs">
                              <li>
                                <ArrowRightOutlined />
                                {' '}
                                Image must be clear
                              </li>
                              <li>
                                <ArrowRightOutlined />
                                {' '}
                                Your ID must be fully in frame
                              </li>
                              <li>
                                <ArrowRightOutlined />
                                {' '}
                                Must be in color
                              </li>
                              <li>
                                <ArrowRightOutlined />
                                {' '}
                                Text must be clearly visible
                              </li>
                            </ul>
                            <div className="example">
                              <p className="example-text">Example photo of you  holding the ID or Passport</p>
                              <img className="example-photo" src="/static/example-upload-photo.png" alt="examplePhoto" />
                            </div>
                            <div className="register-form">
                              <Form.Item
                                labelCol={{ span: 24 }}
                                name="idVerificationId"
                                className="model-photo-verification"
                              >
                                <div className="id-block">
                                  <ImageUploadModelRegister yourId onFileReaded={(f) => this.onFileReaded(f, 'idFile')} />
                                </div>
                              </Form.Item>
                              <Form.Item
                                labelCol={{ span: 24 }}
                                name="documentVerificationId"
                                className="model-photo-verification"
                              >
                                <div className="id-block" style={{ marginTop: '12px' }}>
                                  <ImageUploadModelRegister holdingYourId onFileReaded={(f) => this.onFileReaded(f, 'documentFile')} />
                                </div>
                              </Form.Item>
                            </div>
                          </Col>
                        </div>
                        <Col span={24} className="step-wrap">
                          <a className="cancel-btn" aria-hidden onClick={() => this.handlePrevStep()}>{step === 1 ? 'Cancel' : 'Back'}</a>
                          <Button
                            htmlType="submit"
                            className="next-btn"
                            disabled={registerPerformerData.requesting || isLoading || (step === 2 && !idVerification) || (step === 2 && !documentVerification)}
                            loading={registerPerformerData.requesting || isLoading}
                          >
                            {step === 2 ? 'Create Account' : 'Next'}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {step === 1
                    && (
                      <>
                        <Divider>or</Divider>
                        <div className="social-login">
                          <GoogleLoginButton
                            clientId={settings.googleClientId}
                            onSuccess={this.onGoogleLogin.bind(this)}
                            onFailure={this.onGoogleLogin.bind(this)}
                            text="Sign Up with Google"
                          />
                          <button
                            type="button"
                            disabled={!settings.twitterClientId}
                            onClick={() => this.loginTwitter()}
                            className="twitter-button"
                          >
                            <TwitterOutlined />
                            {' '}
                            <span className="text">Sign Up with Twitter</span>
                          </button>
                        </div>
                      </>
                    )}
                </Form>
              </div>
              <div className="terms-of-service">
                <p>
                  By signing up you agree to our
                  {' '}
                  <a href="/page/term-of-service" target="_blank">
                    Terms of Service
                  </a>
                  {' '}
                  and
                  {' '}
                  <a href="/page/privacy-policy" target="_blank">
                    Privacy Policy
                  </a>
                  , and confirm that you are at least 18 years old.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  settings: { ...state.settings },
  registerPerformerData: { ...state.auth.registerPerformerData }
});

const mapDispatchToProps = { registerPerformer, loginSocial };

export default connect(mapStatesToProps, mapDispatchToProps)(RegisterPerformer);
