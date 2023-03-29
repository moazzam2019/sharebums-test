import { PureComponent } from 'react';
import {
  Layout, Divider, Button
} from 'antd';
import Head from 'next/head';
import { connect } from 'react-redux';
import Link from 'next/link';
import './index.less';
import PageHeading from '@components/common/page-heading';
import {
  DollarLandingPageSvg, LockLandingPage, UserLandingPageSvg, VideoFillIcon
} from 'src/icons';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface IProps {
  ui: any;
}

class ModelLandingPage extends PureComponent<IProps> {
  static authenticate = false;

  static layout = 'blank';

  render() {
    const { ui } = this.props;
    return (
      <>
        <Head>
          <title>
            {ui?.siteName}
            {' '}
            | Model Landing Page
          </title>
        </Head>
        <Layout>
          <div className="main-container model-landing">
            <PageHeading title="Back" />
            <h1 className="title-top">Sharebums</h1>
            <div className="banner-landing">
              <div className="item-banner-1">
                <button type="button">
                  <LockLandingPage />
                  {' '}
                  Subscribe to unlock
                </button>
              </div>
              <div className="item-banner-2">
                <button type="button">
                  <LockLandingPage />
                  {' '}
                  Unlock for 17$
                </button>
                <div className="card-landing-bottom">
                  <VideoFillIcon />
                  {' '}
                  00:25
                </div>
              </div>
              <div className="item-banner-3">
                <button type="button">
                  <LockLandingPage />
                  {' '}
                  Unlock for 14$
                </button>
              </div>
            </div>
            <div className="become">
              <h1>
                Become a
                {' '}
                <br />
                {' '}
                Sharebums creator
              </h1>
              <p>
                Complete the application and become a creator.
                <br />
                Your application will only be for verification purposes to make sure
                {' '}
                <br />
                you are you. After you get verified you can start growing your
                {' '}
                <br />
                {' '}
                community & fanbase. Stream, create & monetize your content.

              </p>
              <Link href="/auth/model-register">
                <Button className="primary btn-become-model">
                  Become a model
                </Button>
              </Link>
            </div>
            <Divider style={{ margin: '68px 0 64px 0' }} />
            <div className="grow-audience">
              <UserLandingPageSvg />
              <h2>Grow your audience</h2>
              <p>
                Fans can buy subscriptions, content or send tips to you as a Model.
                <br />
                Promote to your following by posting regularly to your followers.
                <br />
                Build a relationship with your audience across platforms & start your
                <br />
                growth journey.
              </p>
              <Divider style={{ margin: '55px 0 64px 0' }} />
              <DollarLandingPageSvg />
              <h2>80-20% Split </h2>
              <p>You will keep 80% of all earnings</p>
            </div>
            <Divider style={{ margin: '89px 0 64px 0' }} />
            <div className="model-becoming">
              <h3>Becoming a model FAQ</h3>
              <div className="content-becoming">
                <div className="title-becoming">
                  <h4>Why do we verify our Models?</h4>
                </div>
                <p>
                  We verify all creators on our platform to ensure your content is create by
                  <br />
                  you. We work hard to make sure our platform is secure & meets all legal
                  <br />
                  requirements.
                </p>
              </div>
              <div className="content-becoming action">
                <div className="title-becoming">
                  <h4>Why should I become a model on Sharebums?</h4>
                </div>
                <p>
                  Sharebums is a one stop shop for models with nice bums of all kinds. Our
                  <br />
                  vision is to create a platform that’s accessible and inclusive for everyone. We
                  <br />
                  do everything we can to create a psychologically safe digital environment &
                  <br />
                  experience.
                </p>
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStatetoProps = (state: any) => ({
  ui: { ...state.ui }
});

export default connect(mapStatetoProps)(ModelLandingPage);
