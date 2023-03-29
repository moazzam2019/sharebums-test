import Head from 'next/head';
import { PureComponent } from 'react';
import {
  Layout
} from 'antd';
import PageHeading from '@components/common/page-heading';
import { connect } from 'react-redux';
import { IUIConfig } from '@interfaces/index';
import FeedForm from '@components/post/form';
import {
  PictureOutlined, VideoCameraOutlined, FireOutlined
} from '@ant-design/icons';
import classNames from 'classnames';

interface IProps {
  ui: IUIConfig;
  type: string;
}

class CreatePost extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return { type: ctx?.query?.type };
  }

  state = {
    isSelected: false,
    type: ''
  };

  componentDidMount() {
    const { type } = this.props;
    if (type) {
      this.setState({ type, isSelected: true });
    }
  }

  render() {
    const { ui, type: queryType } = this.props;
    const { isSelected, type } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            { ui?.siteName }
            {' '}
            | New Post
          </title>
        </Head>
        <div className="main-container">
          <PageHeading icon={<FireOutlined />} title={` New ${queryType || type} Post`} />
          <div>
            {!isSelected ? (
              <div className={classNames({
                'story-switch-type': true,
                active: !queryType
              })}
              >
                <div aria-hidden className="type-item left" onClick={() => this.setState({ type: 'photo', isSelected: true })}>
                  <span><PictureOutlined /></span>
                  <p>Create a Photo post</p>
                </div>
                <div aria-hidden className="type-item right" onClick={() => this.setState({ type: 'video', isSelected: true })}>
                  <span><VideoCameraOutlined /></span>
                  <p>Create a Video post</p>
                </div>
                <div aria-hidden className="type-item middle" onClick={() => this.setState({ type: 'text', isSelected: true })}>
                  <span>Aa</span>
                  <p>Create a Text post</p>
                </div>
              </div>
            ) : (<FeedForm type={queryType || type} />)}
          </div>
        </div>
      </Layout>
    );
  }
}
const mapStates = (state) => ({
  ui: { ...state.ui }
});
export default connect(mapStates)(CreatePost);
