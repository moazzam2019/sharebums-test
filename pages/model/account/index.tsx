import Head from "next/head";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { Tabs, message, Layout } from "antd";
import { IPerformer, IUIConfig, ICountry, IBody } from "src/interfaces";
import BlockCountries from "../block-countries";
import {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
} from "src/redux/user/actions";
import { authService, performerService, utilsService } from "@services/index";
import {
  PerformerAccountForm,
  PerformerSubscriptionForm,
  PerformerVerificationForm,
} from "@components/performer";
import "../../user/index.less";
import "./index.less";
import {
  BlockCountriesIcon,
  BlockAccountsIcon,
  BankingIcon,
  IdIcon,
  AccountIcon,
  AppearanceIcon,
  PricingIcon,
  LeftArrowIcon,
} from "src/icons";
import Link from "next/link";

interface IProps {
  currentUser: IPerformer;
  updatePerformer: Function;
  updating: boolean;
  updateCurrentUserAvatar: Function;
  ui: IUIConfig;
  updateCurrentUserCover: Function;
  countries: ICountry[];
  bodyInfo: IBody;
}
class AccountSettings extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps() {
    const [countries, bodyInfo] = await Promise.all([
      utilsService.countriesList(),
      utilsService.bodyInfo(),
    ]);
    return {
      countries: countries?.data || [],
      bodyInfo: bodyInfo?.data,
    };
  }

  _intervalCountdown: any;

  state = {
    emailSending: false,
    countTime: 60,
    menuItem: "appearance",
  };

  handleCountdown = async () => {
    const { countTime } = this.state;
    if (countTime === 0) {
      clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
      return;
    }
    this.setState({ countTime: countTime - 1 });
    this._intervalCountdown = setInterval(this.coundown.bind(this), 1000);
  };

  onAvatarUploaded(data: any) {
    const { updateCurrentUserAvatar: handleUpdateAvt } = this.props;
    message.success("Changes saved");
    handleUpdateAvt(data.response.data.url);
  }

  onCoverUploaded(data: any) {
    const { updateCurrentUserCover: handleUpdateCover } = this.props;
    message.success("Changes saved");
    handleUpdateCover(data.response.data.url);
  }

  coundown() {
    const { countTime } = this.state;
    this.setState({ countTime: countTime - 1 });
  }

  async submit(data: any) {
    const { currentUser, updatePerformer: handleUpdatePerformer } = this.props;
    handleUpdatePerformer({
      ...currentUser,
      ...data,
    });
  }

  async verifyEmail() {
    const { currentUser } = this.props;
    try {
      await this.setState({ emailSending: true });
      const resp = await authService.verifyEmail({
        sourceType: "performer",
        source: currentUser,
      });
      this.handleCountdown();
      resp.data && resp.data.message && message.success(resp.data.message);
    } catch (e) {
      const error = await e;
      message.success(
        error?.message || "An error occured, please try again later"
      );
    } finally {
      this.setState({ emailSending: false });
    }
  }

  appearanceClick = () => {
    this.setState({ menuItem: "appearance" });
  };

  accountClick = () => {
    this.setState({ menuItem: "account" });
  };

  pricingClick = () => {
    this.setState({ menuItem: "pricing" });
  };

  idClick = () => {
    this.setState({ menuItem: "iddocuments" });
  };

  bankingClick = () => {
    this.setState({ menuItem: "banking" });
  };

  blockCountriesClick = () => {
    this.setState({ menuItem: "blockcountries" });
  };

  blockAccountsClick = () => {
    this.setState({ menuItem: "blockaccounts" });
  };

  render() {
    const { currentUser, updating, ui, countries, bodyInfo } = this.props;
    const { emailSending, countTime, menuItem } = this.state;
    console.log(this.props);
    const uploadHeaders = {
      authorization: authService.getToken(),
    };
    return (
      <div className="main-account-body">
        <Head>
          <title>{ui && ui.siteName} | Edit Profile</title>
        </Head>

        <div className="main-container user-account">
          {!currentUser.verifiedDocument && (
            <div className="verify-info">
              Your ID documents are not verified yet! You could not post any
              content right now.
              <p>
                If you have any question, please contact our administrator to
                get more information.
              </p>
            </div>
          )}
          <div className="account-main-container">
            <Link href="/home">
              <div className="left-arrow-icon">
                <LeftArrowIcon />
              </div>
            </Link>
            <div className="account-left-container">
              <div
                className={`account-menu-item ${
                  menuItem === "appearance" ? "selected-menu-item" : ""
                }`}
                onClick={this.appearanceClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <AppearanceIcon />
                </div>
                <div>Appearance</div>
              </div>
              <div
                className={`account-menu-item ${
                  menuItem === "account" ? "selected-menu-item" : ""
                }`}
                onClick={this.accountClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <AccountIcon />
                </div>
                <div>Personal Information & Account</div>
              </div>
              <div
                className={`account-menu-item ${
                  menuItem === "pricing" ? "selected-menu-item" : ""
                }`}
                onClick={this.pricingClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <PricingIcon />
                </div>
                <div>Pricing settings</div>
              </div>
              <div
                className={`account-menu-item ${
                  menuItem === "iddocuments" ? "selected-menu-item" : ""
                }`}
                onClick={this.idClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <IdIcon />
                </div>
                <div>Id documents</div>
              </div>
              <div
                className={`account-menu-item ${
                  menuItem === "banking" ? "selected-menu-item" : ""
                }`}
                onClick={this.bankingClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <BankingIcon />
                </div>
                <div>Banking</div>
              </div>
              <div
                className={`account-menu-item ${
                  menuItem === "blockcountries" ? "selected-menu-item" : ""
                }`}
                onClick={this.blockCountriesClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <BlockCountriesIcon />
                </div>
                <div>Block Countries</div>
              </div>
              <div
                className={`account-menu-item ${
                  menuItem === "blockaccounts" ? "selected-menu-item" : ""
                }`}
                onClick={this.blockAccountsClick}
              >
                <div style={{ marginRight: "10px", paddingTop: "1px" }}>
                  <BlockAccountsIcon />
                </div>
                <div>Block Fans</div>
              </div>
            </div>
            <div className="account-right-container">
              {menuItem === "appearance" && (
                <>
                  <div className="account-menu-title">Appearance</div>
                  <div className="account-menu-description">
                    This is where you can edit your profile & add a introduction
                    video.
                  </div>
                </>
              )}
              {menuItem === "account" && (
                <>
                  <div className="account-menu-title">
                    Personal Information & Account
                  </div>
                  <div className="account-menu-description">
                    This is where you can manage your personal information and
                    account. Your personal information will never be shared or
                    published anywhere. It is only for verifying that you are
                    you and of legal age.
                  </div>
                </>
              )}
              {menuItem === "pricing" && (
                <>
                  <div className="account-menu-title">Pricing Settings</div>
                  <div className="account-menu-description">
                    This is where you can set your monthly subscription price.
                  </div>
                </>
              )}
              {menuItem === "iddocuments" && (
                <>
                  <div className="account-menu-title">ID Documents</div>
                  <div className="account-menu-description">
                    This will never be shared and is only for verifying purposes
                    and to make sure you are of legal age.
                  </div>
                  <div>
                    <PerformerVerificationForm user={currentUser} />
                  </div>
                </>
              )}
              {menuItem === "banking" && (
                <>
                  <div className="account-menu-title">Banking</div>
                  <div className="account-menu-description">
                    Set up preferred account where you would like your payouts
                    to be deposited to:
                  </div>
                </>
              )}
              {menuItem === "blockcountries" && (
                <>
                  <div className="account-menu-title">Block Countries</div>
                  <div className="account-menu-description">
                    Block which countries you do not want getting access to your
                    content.
                  </div>
                  <div>
                    <BlockCountries countries={countries} />
                  </div>
                </>
              )}
              {menuItem === "blockaccounts" && (
                <>
                  <div className="account-menu-title">Block Fans</div>
                  <div className="account-menu-description">
                    This is where you can block fans that you don’t wish to have
                    access to your profile anymore.
                  </div>
                </>
              )}
            </div>
          </div>
          <Tabs
            defaultActiveKey="basic"
            tabPosition="top"
            className="nav-tabs custom"
          >
            <Tabs.TabPane tab={<span>Basic Settings</span>} key="basic">
              <PerformerAccountForm
                onFinish={this.submit.bind(this)}
                updating={updating || emailSending}
                countTime={countTime}
                onVerifyEmail={this.verifyEmail.bind(this)}
                user={currentUser}
                options={{
                  uploadHeaders,
                  avatarUploadUrl: performerService.getAvatarUploadUrl(),
                  onAvatarUploaded: this.onAvatarUploaded.bind(this),
                  coverUploadUrl: performerService.getCoverUploadUrl(),
                  onCoverUploaded: this.onCoverUploaded.bind(this),
                  videoUploadUrl: performerService.getVideoUploadUrl(),
                }}
                countries={countries}
                bodyInfo={bodyInfo}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>ID Documents</span>} key="verification">
              <PerformerVerificationForm user={currentUser} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<span>Pricing Settings</span>}
              key="subscription"
            >
              <PerformerSubscriptionForm
                onFinish={this.submit.bind(this)}
                updating={updating}
                user={currentUser}
              />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab={<span>Change Password</span>} key="password">
              <UpdatePaswordForm
                onFinish={this.updatePassword.bind(this)}
                updating={pwUpdating}
              />
            </Tabs.TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStates = (state: any) => ({
  currentUser: state.user.current,
  updating: state.user.updating,
  ui: { ...state.ui },
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
};
export default connect(mapStates, mapDispatch)(AccountSettings);
