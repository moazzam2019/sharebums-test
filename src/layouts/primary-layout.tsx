import { PureComponent } from "react";
import dynamic from "next/dynamic";
import { Layout, BackTop } from "antd";
import { connect } from "react-redux";
import { Router } from "next/router";
import { IUIConfig } from "src/interfaces/ui-config";
import { loadUIValue } from "@redux/ui/actions";
import "./primary-layout.less";

const Header = dynamic(() => import("@components/common/layout/header"));
// const Footer = dynamic(() => import('@components/common/layout/footer'));
const Loader = dynamic(() => import("@components/common/base/loader"));
const FooterCustom = dynamic(
  () => import("@components/common/layout/footer-custom")
);

interface DefaultProps {
  loadUIValue: Function;
  children: any;
  ui: IUIConfig;
}

class PrimaryLayout extends PureComponent<DefaultProps> {
  state = {
    routerChange: false,
  };

  componentDidMount() {
    const { loadUIValue: handleLoadUI } = this.props;
    process.browser && handleLoadUI();
    process.browser && this.handleStateChange();
  }

  handleStateChange() {
    Router.events.on("routeChangeStart", async () =>
      this.setState({ routerChange: true })
    );
    Router.events.on("routeChangeComplete", async () =>
      this.setState({ routerChange: false })
    );
  }

  render() {
    const { children, ui } = this.props;
    const { routerChange } = this.state;
    return (
      <>
        <Layout>
          <div
            className={ui?.theme === "dark" ? "container dark" : "container"}
            id="primaryLayout"
          >
            <Header />
            <Layout.Content
              className="content"
              style={{ position: "relative" }}
            >
              {routerChange && <Loader />}
              {children}
            </Layout.Content>
            <BackTop className="backTop" />
            <FooterCustom />
            {/* <Footer /> */}
          </div>
        </Layout>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ui: { ...state.ui },
});
const mapDispatchToProps = { loadUIValue };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
