import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmojiWithRef from "react-input-emoji";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, isMsgLoading, message, sendTextMsg } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMsg, setTextMsg] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // console.log("chatbox", currentChat);
  // console.log("textMsg", textMsg);

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Please select a conversation.
      </p>
    );

  if (isMsgLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Message is loading, please wait
      </p>
    );

  return (
    <Stack gap={3} className="chat-box flex-grow-1">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {message &&
          message.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === user._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-starts flex-grow-0"
              }`}
              ref={scrollRef}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmojiWithRef
          value={textMsg}
          onChange={setTextMsg}
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMsg(textMsg, user, currentChat._id, setTextMsg)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
          </svg>
          ˝
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
