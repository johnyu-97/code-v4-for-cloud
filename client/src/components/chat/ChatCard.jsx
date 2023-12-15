import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { faker } from "@faker-js/faker";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const ChatCard = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-item-center p-3 justify-content-between"
      role="button"
    >
      <Stack direction="horizontal" className="d-flex">
        <div className="me-2">
          <img src={faker.image.avatar()} style={{ height: 36 }} />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
        </div>
      </Stack>
      <div className="d-flex flex-column align-items-end">
        <div
          className={
            isOnline ? "user-online position-relative" : "position-relative"
          }
        ></div>
      </div>
    </Stack>
  );
};

export default ChatCard;
