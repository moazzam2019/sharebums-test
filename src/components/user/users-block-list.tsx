import { Table, Button, Tooltip, Avatar } from "antd";
import { formatDate } from "@lib/date";
import "../../../pages/model/block-user/index.less";
import { TickIcon, DeleteIcon } from "src/icons";

interface IProps {
  items: any[];
  searching: boolean;
  total: number;
  pageSize: number;
  onPaginationChange: Function;
  unblockUser: Function;
  submiting: boolean;
}

const UsersBlockList = ({
  items,
  searching,
  total,
  pageSize,
  onPaginationChange,
  unblockUser,
  submiting,
}: IProps) => {
  const columns = [
    {
      title: "User",
      dataIndex: "targetInfo",
      key: "targetInfo",
      render: (targetInfo: any) => (
        <span>
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <Avatar
            src={targetInfo?.avatar || "/static/no-avatar.png"}
            size={28}
          />{" "}
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {targetInfo?.name || targetInfo?.username || "N/A"}
        </span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: any) => (
        <Tooltip title={reason}>
          <div
            style={{
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {reason}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (createdAt: Date) => <span>{formatDate(createdAt)}</span>,
      sorter: true,
    },
    {
      title: "Action",
      key: "_id",
      render: (item) => (
        <Button
          className="unblock-user"
          type="primary"
          disabled={submiting}
          onClick={() => unblockUser(item.targetId)}
        >
          Unblock
        </Button>
      ),
    },
  ];
  const dataSource = items.map((p) => ({ ...p, key: p._id }));

  // console.log(items);
  return (
    <>
      {/* <Table
        dataSource={dataSource}
        columns={columns}
        className="table"
        pagination={{
          total,
          pageSize,
        }}
        scroll={{ x: true }}
        loading={searching}
        onChange={onPaginationChange.bind(this)}
      /> */}
      {items.map((el) => (
        <div className="block-fans-bottom">
          <img
            src={el?.targetInfo?.avatar}
            alt={el?.targetInfo?.name}
            className="block-fans-image"
          />
          <div className="block-fans-name">{el?.targetInfo?.name}</div>
          <div className="block-fans-verify-icon">
            <TickIcon />
          </div>
          <div
            className="block-fans-delete-icon"
            onClick={() => unblockUser(el.targetId)}
          >
            <DeleteIcon />{" "}
          </div>
        </div>
      ))}
      {/* <Button
        className="primary"
        htmlType="submit"
        style={{ marginTop: "20px" }}
      >
        Save Changes
      </Button> */}
    </>
  );
};
UsersBlockList.defaultProps = {};
export default UsersBlockList;
