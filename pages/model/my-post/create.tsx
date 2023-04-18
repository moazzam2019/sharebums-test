import Head from "next/head";
import { PureComponent } from "react";
import { Layout } from "antd";
import PageHeading from "@components/common/page-heading";
import { connect } from "react-redux";
import { IUIConfig } from "@interfaces/index";
import FeedForm from "@components/post/form";
import {
  PictureOutlined,
  VideoCameraOutlined,
  FireOutlined,
} from "@ant-design/icons";
import classNames from "classnames";

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
    type: "",
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
      <div
        style={{
          background: "#16182305",
          height: "100vh",
          marginTop: "-60px",
        }}
      >
        <Head>
          <title>{ui?.siteName} | New Post</title>
        </Head>
        <div
          className="main-container"
          style={{
            width: "758px",
            height: "774px",
            backgroundColor: "white",
            position: "relative",
            top: "51px",
            padding: "40px",
            borderRadius: "12px",
          }}
        >
          {/* <PageHeading
            icon={<FireOutlined />}
            title={` New ${queryType || type} Post`}
          /> */}
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Inter",
                fontSize: "18px",
                lineHeight: "24px",
                letterSpacing: "0.02em",
              }}
            >
              New Post
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0.02em",
                marginTop: "10px",
              }}
            >
              Publish a video or image to your account
            </div>
          </div>
          <div>
            {!isSelected ? (
              <div
                className={classNames({
                  "story-switch-type": true,
                  active: !queryType,
                })}
              >
                <div
                  aria-hidden
                  className="type-item left"
                  onClick={() =>
                    this.setState({ type: "photo", isSelected: true })
                  }
                >
                  <span>
                    <PictureOutlined />
                  </span>
                  <p>Create a Photo post</p>
                </div>
                <div
                  aria-hidden
                  className="type-item right"
                  onClick={() =>
                    this.setState({ type: "video", isSelected: true })
                  }
                >
                  <span>
                    <VideoCameraOutlined />
                  </span>
                  <p>Create a Video post</p>
                </div>
                <div
                  aria-hidden
                  className="type-item middle"
                  onClick={() =>
                    this.setState({ type: "text", isSelected: true })
                  }
                >
                  <span>Aa</span>
                  <p>Create a Text post</p>
                </div>
              </div>
            ) : (
              <FeedForm type={queryType || type} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStates = (state) => ({
  ui: { ...state.ui },
});
export default connect(mapStates)(CreatePost);
