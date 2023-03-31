import { PureComponent } from "react";
import { Layout, Badge, Drawer, Divider, Avatar, Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import Link from "next/link";
import { IUser, StreamSettings, IUIConfig, ISettings } from "src/interfaces";
import { logout } from "@redux/auth/actions";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  VideoCameraOutlined,
  FireOutlined,
  NotificationOutlined,
  BookOutlined,
  DollarOutlined,
  PictureOutlined,
  StarOutlined,
  ShoppingOutlined,
  BankOutlined,
  LogoutOutlined,
  HeartOutlined,
  BlockOutlined,
  PlusCircleOutlined,
  StopOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  HomeIcon,
  ModelIcon,
  PlusIcon,
  MessageIcon,
  UserIcon,
  LiveIcon,
  TickIcon,
  WalletSvg,
  ImageIcon,
  VideoIcon,
  NotificationIcon,
} from "src/icons";
import Router, { withRouter, Router as RouterEvent } from "next/router";
import { messageService, authService } from "src/services";
import { Event, SocketContext } from "src/socket";
import { updateUIValue } from "src/redux/ui/actions";
import { updateBalance } from "@redux/user/actions";
import { shortenLargeNumber } from "@lib/number";
import { SubscribePerformerModal } from "src/components/subscription/subscribe-performer-modal";
import "./header.less";

interface IProps {
  updateBalance: Function;
  user: IUser;
  logout: Function;
  router: any;
  ui: IUIConfig;
  settings: StreamSettings;
  config: ISettings;
}

const menu = (
  <Menu>
    <Menu.Item
      key="photo"
      onClick={() =>
        Router.push({
          pathname: "/model/my-post/create",
          query: { type: "photo" },
        })
      }
    >
      <ImageIcon />
      <a>Photo Post</a>
    </Menu.Item>
    <Menu.Item
      key="video"
      onClick={() =>
        Router.push({
          pathname: "/model/my-post/create",
          query: { type: "video" },
        })
      }
    >
      <VideoIcon />
      <a>Video Post</a>
    </Menu.Item>
  </Menu>
);

class Header extends PureComponent<IProps> {
  state = {
    totalNotReadMessage: 0,
    openProfile: false,
  };

  componentDidMount() {
    RouterEvent.events.on("routeChangeStart", this.handleChangeRoute);
    const { user } = this.props;
    if (user._id) {
      this.handleCountNotificationMessage();
    }
  }

  componentDidUpdate(prevProps: any) {
    const { user } = this.props;
    if (user._id && prevProps.user._id !== user._id) {
      this.handleCountNotificationMessage();
    }
  }

  componentWillUnmount() {
    RouterEvent.events.off("routeChangeStart", this.handleChangeRoute);
    const token = authService.getToken();
    const socket = this.context;
    token && socket && socket.emit("auth/logout", { token });
  }

  handleChangeRoute = () => {
    this.setState({
      openProfile: false,
    });
  };

  handleMessage = async (event) => {
    event && this.setState({ totalNotReadMessage: event.total });
  };

  handleSubscribe = (username) => {
    Router.push(
      { pathname: "/streaming/details", query: { username } },
      `/streaming/${username}`
    );
  };

  async handleCountNotificationMessage() {
    const data = await (await messageService.countTotalNotRead()).data;
    if (data) {
      this.setState({ totalNotReadMessage: data.total });
    }
  }

  async handleUpdateBalance(event) {
    const { user, updateBalance: handleUpdateBalance } = this.props;
    if (user.isPerformer) {
      handleUpdateBalance({ token: event.token });
    }
  }

  async handlePaymentStatusCallback({ redirectUrl }) {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }

  async beforeLogout() {
    const { logout: handleLogout } = this.props;
    const token = authService.getToken();
    const socket = this.context;
    token &&
      socket &&
      (await socket.emit("auth/logout", {
        token,
      }));
    handleLogout();
  }

  render() {
    const { user, router, ui, settings, config } = this.props;
    const { totalNotReadMessage, openProfile } = this.state;

    return (
      <div>
        <div className="main-header">
          <Event
            event="nofify_read_messages_in_conversation"
            handler={this.handleMessage.bind(this)}
          />
          <Event
            event="update_balance"
            handler={this.handleUpdateBalance.bind(this)}
          />
          <Event
            event="payment_status_callback"
            handler={this.handlePaymentStatusCallback.bind(this)}
          />
          <div className="main-container">
            <Layout.Header className="header" id="layoutHeader">
              <div className="nav-bar">
                <div style={{ cursor: "pointer" }} className="sharebums-logo">
                  <Link href="/home">
                    <a>Sharebums</a>
                  </Link>
                </div>
                <ul className={user._id ? "nav-icons" : "nav-icons custom"}>
                  {user._id && <div />}
                  {user._id && (
                    <div className="icons-item">
                      {/* {user._id && (
                      <li
                        className={router.pathname === "/home" ? "active" : ""}
                        style={{ backgroundColor: "yellow" }}
                      >
                        <Link href="/home">
                          <a>
                            <HomeIcon />
                          </a>
                        </Link>
                      </li>
                    )} */}
                      {user._id && (
                        <>
                          {user?.isPerformer && (
                            <li
                              className={
                                router.pathname === "/model/my-post/create"
                                  ? "active cutoms"
                                  : "cutoms"
                              }
                            >
                              <Dropdown overlay={menu} placement="bottomCenter">
                                <a
                                  style={{
                                    border: "1px solid grey",
                                    padding: "6px 16px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <span style={{ fontSize: "18px" }}>+</span>
                                  <span> New post</span>
                                </a>
                              </Dropdown>
                            </li>
                          )}
                        </>
                      )}
                      {user._id && !user.isPerformer && (
                        <li
                          key="model"
                          className={
                            router.pathname === "/model" ? "active" : ""
                          }
                        >
                          <Link href="/model">
                            <a>
                              <ModelIcon />
                            </a>
                          </Link>
                        </li>
                      )}
                      {user._id && (
                        <li
                          key="messenger"
                          className={
                            router.pathname === "/messages" ? "active" : ""
                          }
                        >
                          <Link href="/messages">
                            <a>
                              <MessageIcon />
                              <Badge
                                className="cart-total"
                                count={totalNotReadMessage}
                                showZero
                              />
                            </a>
                          </Link>
                        </li>
                      )}
                      {user._id && (
                        <li
                          key="notification"
                          className={
                            router.pathname === "/set this" ? "active" : ""
                          }
                        >
                          <Link href="/messages">
                            <a>
                              <NotificationIcon />{" "}
                              <Badge
                                className="cart-total"
                                count={totalNotReadMessage}
                                showZero
                              />
                            </a>
                          </Link>
                        </li>
                      )}
                    </div>
                  )}
                  {!user._id && [
                    <li key="logo" className="logo-nav">
                      <Link href="/home">
                        <a>
                          {ui.logo ? (
                            <img src={ui.logo} alt="logo" />
                          ) : (
                            `${ui.siteName}`
                          )}
                        </a>
                      </Link>
                    </li>,
                    <li
                      key="login"
                      className={router.pathname === "/" ? "active" : ""}
                    >
                      <Link href="/">
                        <a>Log In</a>
                      </Link>
                    </li>,
                    <li
                      key="signup"
                      className={
                        router.pathname === "/auth/register" ? "active" : ""
                      }
                    >
                      <Link href="/auth/register">
                        <a>Sign Up</a>
                      </Link>
                    </li>,
                  ]}
                  {user._id && (
                    <li
                      key="avatar"
                      aria-hidden
                      onClick={() => this.setState({ openProfile: true })}
                    >
                      {user?.avatar ? (
                        <Avatar src={user?.avatar || "/static/no-avatar.png"} />
                      ) : (
                        <UserIcon />
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </Layout.Header>
            <Drawer
              title={
                <>
                  <div className="profile-user">
                    <img
                      className="avatar"
                      src={user?.avatar || "/static/no-avatar.png"}
                      alt="avatar"
                    />
                    <span className="profile-name">
                      <span>
                        {user?.name || "N/A"} <TickIcon />
                      </span>
                      <span className="sub-name">
                        @{user?.username || "n/a"}
                      </span>
                    </span>
                  </div>
                  <div className="sub-info">
                    <a
                      aria-hidden
                      className="user-balance"
                      onClick={() =>
                        !user?.isPerformer
                          ? Router.push("/wallet")
                          : Router.push("/model/earning")
                      }
                    >
                      <WalletSvg /> ${(user?.balance || 0).toFixed(2)}
                      {!user?.isPerformer && <PlusCircleOutlined />}
                    </a>
                    {user.isPerformer ? (
                      <Link href="/model/my-subscriber">
                        <a>
                          <StarOutlined />
                          Subscribers{" "}
                          {shortenLargeNumber(user?.stats?.subscribers || 0)}
                        </a>
                      </Link>
                    ) : (
                      <Link href="/user/my-subscription">
                        <a>
                          <HeartOutlined />
                          Subscription{" "}
                          {shortenLargeNumber(
                            user?.stats?.totalSubscriptions || 0
                          )}
                        </a>
                      </Link>
                    )}
                  </div>
                </>
              }
              closable
              onClose={() => this.setState({ openProfile: false })}
              visible={openProfile}
              key="profile-drawer"
              className={
                ui.theme === "light" ? "profile-drawer" : "profile-drawer dark"
              }
              width={280}
            >
              {user.isPerformer && (
                <div className="profile-menu-item">
                  {settings?.agoraEnable && (
                    <Link href={{ pathname: "/model/live" }} as="/model/live">
                      <div
                        className={
                          router.asPath === "/model/live"
                            ? "menu-item active"
                            : "menu-item"
                        }
                      >
                        <LiveIcon /> Go Live
                      </div>
                    </Link>
                  )}
                  <Divider />
                  <Link
                    href={{
                      pathname: "/model/profile",
                      query: { username: user.username || user._id },
                    }}
                    as={`/${user.username || user._id}`}
                  >
                    <div
                      className={
                        router.asPath === `/${user.username || user._id}`
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <HomeOutlined /> My Profile
                    </div>
                  </Link>
                  <Link href="/model/account" as="/model/account">
                    <div
                      className={
                        router.pathname === "/model/account"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <UserOutlined /> Edit Profile
                    </div>
                  </Link>
                  <Link
                    href={{ pathname: "/model/block-user" }}
                    as="/model/block-user"
                  >
                    <div
                      className={
                        router.pathname === "/model/block-user"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <BlockOutlined /> Blacklist
                    </div>
                  </Link>
                  <Link
                    href={{ pathname: "/model/block-countries" }}
                    as="/model/block-countries"
                  >
                    <div
                      className={
                        router.pathname === "/model/block-countries"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <StopOutlined /> Block Countries
                    </div>
                  </Link>
                  <Link
                    href={{ pathname: "/model/banking" }}
                    as="/model/banking"
                  >
                    <div
                      className={
                        router.pathname === "/model/banking"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <BankOutlined /> Banking (to earn)
                    </div>
                  </Link>
                  <Divider />
                  <Link href="/model/my-post" as="/model/my-post">
                    <div
                      className={
                        router.pathname === "/model/my-post"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <FireOutlined /> My Feeds
                    </div>
                  </Link>
                  <Link href="/model/my-video" as="/model/my-video">
                    <div
                      className={
                        router.pathname === "/model/my-video"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <VideoCameraOutlined /> My Videos
                    </div>
                  </Link>
                  <Link href="/model/my-store" as="/model/my-store">
                    <div
                      className={
                        router.pathname === "/model/my-store"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <ShoppingOutlined /> My Products
                    </div>
                  </Link>
                  <Link href="/model/my-gallery" as="/model/my-gallery">
                    <div
                      className={
                        router.pathname === "/model/my-gallery"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <PictureOutlined /> My Galleries
                    </div>
                  </Link>
                  <Divider />
                  <Link
                    href={{ pathname: "/model/my-order" }}
                    as="/model/my-order"
                  >
                    <div
                      className={
                        router.pathname === "/model/my-order"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <ShoppingCartOutlined /> Order History
                    </div>
                  </Link>
                  <Link href="/model/earning" as="/model/earning">
                    <div
                      className={
                        router.pathname === "/model/earning"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <DollarOutlined /> Earning History
                    </div>
                  </Link>
                  <Link href="/model/payout-request" as="/model/payout-request">
                    <div
                      className={
                        router.pathname === "/model/payout-request"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <NotificationOutlined /> Payout Requests
                    </div>
                  </Link>
                  <Divider />
                  <div
                    aria-hidden
                    className="menu-item"
                    onClick={() => this.beforeLogout()}
                  >
                    <LogoutOutlined /> Sign Out
                  </div>
                </div>
              )}
              {!user.isPerformer && (
                <div className="profile-menu-item">
                  <Link href="/user/account" as="/user/account">
                    <div
                      className={
                        router.pathname === "/user/account"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <UserOutlined /> Edit Profile
                    </div>
                  </Link>
                  {config.paymentGateway === "stripe" && (
                    <Link href="/user/cards" as="/user/cards">
                      <div
                        className={
                          router.pathname === "/user/cards"
                            ? "menu-item active"
                            : "menu-item"
                        }
                      >
                        <CreditCardOutlined /> Add Card
                      </div>
                    </Link>
                  )}
                  <Link href="/user/bookmarks" as="/user/bookmarks">
                    <div
                      className={
                        router.pathname === "/user/bookmarks"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <BookOutlined /> Bookmarks
                    </div>
                  </Link>
                  <Link href="/user/my-subscription" as="/user/my-subscription">
                    <div
                      className={
                        router.pathname === "/user/my-subscriptions"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <HeartOutlined /> Subscriptions
                    </div>
                  </Link>
                  <Divider />
                  <Link href="/user/orders" as="/user/orders">
                    <div
                      className={
                        router.pathname === "/user/orders"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <ShoppingCartOutlined /> Order History
                    </div>
                  </Link>
                  <Link href="/user/payment-history" as="/user/payment-history">
                    <div
                      className={
                        router.pathname === "/user/payment-history"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <HistoryOutlined /> Payment History
                    </div>
                  </Link>
                  <Link
                    href="/user/wallet-transaction"
                    as="/user/wallet-transaction"
                  >
                    <div
                      className={
                        router.pathname === "/user/wallet-transaction"
                          ? "menu-item active"
                          : "menu-item"
                      }
                    >
                      <DollarOutlined /> Wallet Transactions
                    </div>
                  </Link>
                  <Divider />
                  <div
                    className="menu-item"
                    aria-hidden
                    onClick={() => this.beforeLogout()}
                  >
                    <LogoutOutlined /> Sign Out
                  </div>
                </div>
              )}
              {/* <div className="switchTheme">
              <span>
                <BulbOutlined />
                <span>Switch Theme</span>
              </span>
              <Switch
                onChange={this.onThemeChange.bind(this, ui.theme === 'dark' ? 'light' : 'dark')}
                checked={ui.theme === 'dark'}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            </div> */}
            </Drawer>
            <SubscribePerformerModal onSubscribed={this.handleSubscribe} />
          </div>
        </div>
      </div>
    );
  }
}

Header.contextType = SocketContext;

const mapState = (state: any) => ({
  user: { ...state.user.current },
  ui: { ...state.ui },
  config: { ...state.settings },
  ...state.streaming,
});
const mapDispatch = {
  logout,
  updateUIValue,
  updateBalance,
};
export default withRouter(connect(mapState, mapDispatch)(Header)) as any;
