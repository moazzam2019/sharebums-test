import React from "react";
import moment from "moment";
import { Image, Avatar } from "antd";
import { IUser } from "@interfaces/index";
import "./Message.less";
import { formatDate, formatDateTwo } from "@lib/date";

interface IProps {
  data: any;
  isMine: boolean;
  startsSequence: boolean;
  endsSequence: boolean;
  showTimestamp: boolean;
  currentUser: IUser;
  recipient: IUser;
}

export default function Message(props: IProps) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    currentUser,
    recipient,
  } = props;

  const friendlyTimestamp = formatDate(data.createdAt);
  const friendlyTimestampTwo = formatDateTwo(data.createdAt);
  const date = new Date();
  function isDateDifferenceGreaterThanTenMinutes(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const differenceInMilliseconds = Math.abs(
      date1.getTime() - date2.getTime()
    );
    const differenceInMinutes = differenceInMilliseconds / 60000;
    return differenceInMinutes > 10;
  }
  return (
    <div
      id={data._id}
      className={[
        "message",
        `${isMine ? "mine" : ""}`,
        `${startsSequence ? "start" : ""}`,
        `${endsSequence ? "end" : ""}`,
      ].join(" ")}
    >
      {data.text && (
        <div className="bubble-container">
          {!isMine && (
            <Avatar
              alt=""
              className="avatar"
              src={recipient?.avatar || "/static/no-avatar.png"}
            />
          )}
          <div className="bubble" title={friendlyTimestamp}>
            {!data.imageUrl && data.text}{" "}
            {data.imageUrl && <Image alt="" src={data.imageUrl} preview />}
          </div>
          {isMine && (
            <Avatar
              alt=""
              src={currentUser?.avatar || "/static/no-avatar.png"}
              className="avatar"
            />
          )}
        </div>
      )}
      {showTimestamp && (
        <div className="timestamp">
          {isDateDifferenceGreaterThanTenMinutes(date, data.createdAt)
            ? friendlyTimestamp
            : friendlyTimestampTwo}
        </div>
      )}
    </div>
  );
}
