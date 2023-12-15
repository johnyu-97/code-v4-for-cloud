import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { getUnreadMsg } from "../../utils/getUnreadMsg";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { notification, userChats, allUser, markAllNotiRead } =
    useContext(ChatContext);

  const unread = getUnreadMsg(notification);
  const updatedNoti = notification.map((n) => {
    const sender = allUser.find((user) => user._id === n.senderId);
    return {
      ...n,
      senderName: sender?.name,
    };
  });

  console.log("unread", unread);
  console.log("updatedNoti", updatedNoti);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        noti logo
        {unread?.length === 0 ? null : (
          <span className="notification-count">{unread?.length}</span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notification</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotiRead(notification)}
            >
              Mark all as read
            </div>
          </div>
          {updatedNoti?.length === 0 ? (
            <span className="notification">No message yet.</span>
          ) : null}
          {updatedNoti &&
            updatedNoti.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                >
                  <span>{`${n.senderName} sent a new message to you`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
