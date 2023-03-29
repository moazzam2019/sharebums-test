/* eslint-disable prefer-promise-reject-errors */
import {
  Row, Col, Button, Layout, Form, Input, message
} from 'antd';
import { PureComponent } from 'react';
import Link from 'next/link';
import { registerFan, loginSocial } from '@redux/auth/actions';
import { connect } from 'react-redux';
import Head from 'next/head';
import { ISettings, IUIConfig } from 'src/interfaces';
// import { GoogleReCaptcha } from '@components/common';
import { TwitterOutlined } from '@ant-design/icons';
import { authService } from '@services/auth.service';
import './index.less';
import GoogleLoginButton from '@components/auth/google-login-button';
import { LogoLoginIcon } from 'src/icons';

interface IProps {
  ui: IUIConfig;
  settings: ISettings;
  registerFan: Function;
  registerFanData: any;
  loginSocial: Function;
}

class FanRegister extends PureComponent<IProps> {
  static authenticate = false;

  static layout = 'blank';

  recaptchaSuccess = false;

  state = {
    isLoading: false
  };

  handleRegister = (data: any) => {
    const { registerFan: handleRegister } = this.props;
    handleRegister(data);
  };

  handleVerifyCapcha(resp: any) {
    if (resp?.data?.success) {
      this.recaptchaSuccess = true;
    } else {
      this.recaptchaSuccess = false;
    }
  }

  async onGoogleLogin(resp: any) {
    if (!resp?.credential) {
      return;
    }
    const { loginSocial: handleLogin } = this.props;
    const payload = { tokenId: resp.credential, role: 'user' };
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

  async loginTwitter() {
    try {
      await this.setState({ isLoading: true });
      const resp = await (await authService.loginTwitter()).data;
      if (resp && resp.url) {
        authService.setTwitterToken({ oauthToken: resp.oauthToken, oauthTokenSecret: resp.oauthTokenSecret }, 'user');
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
    const { ui, registerFanData, settings } = this.props;
    const { requesting: submiting } = registerFanData;
    const { isLoading } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Sign up
          </title>
        </Head>
        <div className="login-box">
          <Row>
            <Col style={{ padding: 0 }} xs={24} sm={24} md={14} lg={14}>
              <div
                className="login-content left left-custom"
                // style={ui.loginPlaceholderImage ? { backgroundImage: `url(${ui.loginPlaceholderImage})` } : null}
              >
                <div className="bg-left">
                  <div>
                    <div className="bg-left-item">
                      <LogoLoginIcon />
                      <p>Sharebums</p>
                    </div>
                    <p className="text-bg">
                      Discover.Share.Buy content
                      <br />
                      {' '}
                      from your favorite models
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={10} lg={10}>
              <div className="login-content right right-custom">
                <div>
                  <div className="login-form">
                    <h1 className="title-login">Sign up</h1>
                    <Form
                      labelCol={{ span: 24 }}
                      name="member_register"
                      initialValues={{ remember: true, gender: 'male' }}
                      onFinish={this.handleRegister.bind(this)}
                      scrollToFirstError
                    >
                      <Form.Item
                        name="userName"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please input your user name!' },
                          {
                            pattern: new RegExp(
                              /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                            ),
                            message: 'User name can not contain number and special character'
                          }
                        ]}
                      >
                        <Input placeholder="User name" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            type: 'email',
                            message: 'Invalid email address!'
                          },
                          {
                            required: true,
                            message: 'Please input your email address!'
                          }
                        ]}
                      >
                        <Input placeholder="Email address" />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            pattern: new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g),
                            message:
                              'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                          },
                          { required: true, message: 'Please enter your password!' }
                        ]}
                      >
                        <Input.Password placeholder="Password" />
                      </Form.Item>
                      {/* <GoogleReCaptcha ui={ui} handleVerify={this.handleVerifyCapcha.bind(this)} /> */}
                      <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          disabled={submiting || isLoading}
                          loading={submiting || isLoading}
                        >
                          Sign up
                        </Button>

                      </Form.Item>
                    </Form>
                  </div>
                  <div className="social-login">
                    <button
                      type="button"
                      disabled={!settings.twitterClientId}
                      onClick={() => this.loginTwitter()}
                      className="twitter-button"
                    >
                      <TwitterOutlined />
                      {' '}
                      Sign in with Twitter
                    </button>
                    <GoogleLoginButton
                      clientId={settings.googleClientId}
                      onSuccess={this.onGoogleLogin.bind(this)}
                      onFailure={this.onGoogleLogin.bind(this)}
                      text="Sign in with Google"
                    />
                    <p className="auth-item">
                      Are you a model?
                      <Link href="/auth/model-register">
                        <a> Sign up here.</a>
                      </Link>
                    </p>
                    <p>
                      Have an account already?
                      <Link href="/">
                        <a> Log in here.</a>
                      </Link>
                    </p>

                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Layout>
    );
  }
}
const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  settings: { ...state.settings },
  registerFanData: { ...state.auth.registerFanData }
});

const mapDispatchToProps = { registerFan, loginSocial };

export default connect(mapStatesToProps, mapDispatchToProps)(FanRegister);
