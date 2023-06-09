import { Badge, Avatar } from "antd";
import { TickIcon } from "src/icons";
import { formatDateNew, formatDateFromnow } from "@lib/index";
import { IConversation } from "@interfaces/message";
import "./ConversationListItem.less";

interface IProps {
  data: IConversation;
  setActive: Function;
  selected: boolean;
}

export default function ConversationListItem(props: IProps) {
  const { data, setActive, selected } = props;
  const {
    recipientInfo,
    lastMessage,
    _id,
    totalNotSeenMessages = 0,
    lastMessageCreatedAt,
    updatedAt,
  } = data;
  const className = selected
    ? "conversation-list-item active"
    : "conversation-list-item";
  console.log(lastMessageCreatedAt, updatedAt);

  return (
    <div aria-hidden className={className} onClick={() => setActive(_id)}>
      <div className="conversation-left-corner">
        <Avatar
          className="conversation-photo"
          src={recipientInfo?.avatar || "/static/no-avatar.png"}
          alt="avatar"
        />
        <span
          className={
            recipientInfo?.isOnline > 0
              ? "online-status active"
              : "online-status"
          }
        />
      </div>
      <div className="conversation-info">
        <h1 className="conversation-title">
          <span
            className="re-name"
            title={recipientInfo?.name || recipientInfo?.username || "N/A"}
          >
            {recipientInfo?.name || recipientInfo?.username || "N/A"}
            {recipientInfo?.verifiedAccount && <TickIcon />}
          </span>
          <span className="conversation-time"></span>
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="conversation-snippet">{lastMessage}</p>

          <span className="conversation-time">
            {formatDateNew(lastMessageCreatedAt || updatedAt)}
          </span>
        </div>
      </div>
      <Badge className="notification-badge" count={totalNotSeenMessages} />
    </div>
  );
}
