import { Layout, Button, message, Modal, Form, Input, Col } from "antd";
import Head from "next/head";
import React, { PureComponent } from "react";
import { BlockOutlined } from "@ant-design/icons";
import PageHeading from "@components/common/page-heading";
import { connect } from "react-redux";
import { IUIConfig } from "src/interfaces";
import { SelectUserDropdown } from "@components/user/select-users-dropdown";
import { blockService } from "src/services";
import UsersBlockList from "@components/user/users-block-list";
import "./index.less";

interface IProps {
  ui: IUIConfig;
  className?: string;
}

class BlockPage extends PureComponent<IProps> {
  static onlyPerformer = true;

  static authenticate = true;

  state = {
    loading: false,
    submiting: false,
    limit: 10,
    offset: 0,
    blockUserId: "",
    userBlockedList: [],
    totalBlockedUsers: 0,
    openBlockModal: false,
  };

  componentDidMount() {
    this.getBlockList();
  }

  async handleTabChange(data) {
    await this.setState({ offset: data.current - 1 });
    this.getBlockList();
  }

  async handleUnblockUser(userId: string) {
    if (!window.confirm("Are you sure to unblock this user?")) return;
    const { userBlockedList } = this.state;
    try {
      await this.setState({ submiting: true });
      await blockService.unBlockUser(userId);
      message.success("Unblocked successfully");
      this.setState({
        submiting: false,
        userBlockedList: userBlockedList.filter((u) => u.targetId !== userId),
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || "An error occured. Please try again later");
      this.setState({ submiting: false });
    }
  }

  handleBlockUser = async (data) => {
    const { blockUserId: targetId } = this.state;
    // const { reason } = data;
    if (!targetId) {
      message.error("Please select a user");
      return;
    }

    try {
      await this.setState({ submiting: true });
      await blockService.blockUser({ targetId, target: "user" });
      message.success("User profile is blocked successfully");
      this.getBlockList();
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(
        error?.message || "An error occured, please try again later"
      );
    } finally {
      this.setState({ submiting: false, openBlockModal: false });
    }
  };

  async getBlockList() {
    const { limit, offset } = this.state;
    try {
      await this.setState({ loading: true });
      const resp = await blockService.getBlockListUsers({
        limit,
        offset: offset * limit,
      });
      this.setState({
        loading: false,
        userBlockedList: resp.data.data,
        totalBlockedUsers: resp.data.total,
      });
    } catch (e) {
      message.error("An error occured, please try again later");
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      userBlockedList,
      totalBlockedUsers,
      loading,
      limit,
      submiting,
      openBlockModal,
    } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>{`${ui?.siteName} | Blacklist`}</title>
        </Head>
        <div className="main-container">
          {/* <PageHeading icon={<BlockOutlined />} title="Blacklist" /> */}
          {/* <div className="block-user">
            <Button
              className=""
              type="primary"
              onClick={() => this.setState({ openBlockModal: true })}
            >
              Wanna block someone, click here!
            </Button>
          </div> */}
          <Form
            name="blockForm"
            onFinish={() => {
              this.handleBlockUser(this.state.blockUserId);
              this.setState({ blockUserId: "" });
            }}
            initialValues={{ reason: "" }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="account-form"
          >
            <Col xs={24} sm={24} md={10} lg={10}>
              <Form.Item>
                <SelectUserDropdown
                  onSelect={(val) => {
                    this.setState({ blockUserId: val });
                  }}
                  value={this.state.blockUserId} // pass the selected value as a prop
                />
              </Form.Item>
            </Col>
            <div
              className="users-blocked-list"
              style={{ marginTop: "30px", marginBottom: "20px" }}
            >
              <UsersBlockList
                items={userBlockedList}
                searching={loading}
                total={totalBlockedUsers}
                onPaginationChange={this.handleTabChange.bind(this)}
                pageSize={limit}
                submiting={submiting}
                unblockUser={this.handleUnblockUser.bind(this)}
              />
            </div>
            <Form.Item>
              <Button
                className="primary"
                htmlType="submit"
                loading={submiting}
                disabled={submiting}
                style={{ marginRight: "20px" }}
              >
                Save Changes
              </Button>
              {/* <Button
      className="secondary"
      onClick={() => this.setState({ openBlockModal: false })}
    >
      Close
    </Button> */}
            </Form.Item>
          </Form>

          {/* <div className="users-blocked-list">
            <UsersBlockList
              items={userBlockedList}
              searching={loading}
              total={totalBlockedUsers}
              onPaginationChange={this.handleTabChange.bind(this)}
              pageSize={limit}
              submiting={submiting}
              unblockUser={this.handleUnblockUser.bind(this)}
            />
          </div> */}
        </div>
        <Modal
          centered
          title="Block user"
          visible={openBlockModal}
          onCancel={() => this.setState({ openBlockModal: false })}
          footer={null}
          destroyOnClose
        >
          <Form
            name="blockForm"
            onFinish={this.handleBlockUser.bind(this)}
            initialValues={{ reason: "" }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="account-form"
          >
            <Form.Item label="Please select user you want to block">
              <SelectUserDropdown
                onSelect={(val) => this.setState({ blockUserId: val })}
              />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: "Tell us your reason" }]}
            >
              <Input.TextArea placeholder="Enter your reason" />
            </Form.Item>
            <Form.Item>
              <Button
                className="primary"
                htmlType="submit"
                loading={submiting}
                disabled={submiting}
                style={{ marginRight: "20px" }}
              >
                Submit
              </Button>
              <Button
                className="secondary"
                onClick={() => this.setState({ openBlockModal: false })}
              >
                Close
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

const mapStates = (state) => ({
  ui: { ...state.ui },
});
export default connect(mapStates)(BlockPage);
