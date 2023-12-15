import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children, user }) => {
  //handling the chat room of user
  const [userChats, setUserChats] = useState(null);
  const [userChatsErr, setUserChatsErr] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [potentialChats, setPotentialChats] = useState([]);
  //get message in current chat
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState(null);
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const [msgErr, setMsgErr] = useState(null);
  //send message in current chat
  const [sendTextMsgErr, setSendTextMsgErr] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  //msg notification
  const [notification, setNotification] = useState([]);

  //get all user
  const [allUser, setAllUser] = useState([]);

  //Socket.io
  const [socket, setSocket] = useState(null);

  //init socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //socket listener ,set online user
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send message listner to socket
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //receive message and notification
  console.log("noti", notification);
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      console.log(res);
      if (currentChat?._id !== res.chatId) return;
      setMessage((prev) => [...prev, res]);
    });
    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      console.log(isChatOpen);
      if (isChatOpen) {
        setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  //get Potential Chat
  useEffect(() => {
    const getUser = async () => {
      const response = await getRequest(`${baseUrl}/users/get-user`);
      if (response.error) {
        return setPotentialChats(response);
      }
      const possibleChat = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u.id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(possibleChat);
      setAllUser(response);
    };
    getUser();
  }, [userChats]); //dependency array, call it when the array change

  //get User current Chats
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsErr(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsErr(response);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  //update chat selecting
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  //post User new Chats
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log("Error during create chat", response);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  //get chat room msg
  useEffect(() => {
    const getMessage = async () => {
      setIsMsgLoading(true);
      setMsgErr(null);

      const response = await getRequest(`${baseUrl}/msg/${currentChat?._id}`);

      setIsMsgLoading(false);

      if (response.error) {
        return setMsgErr(response);
      }
      setMessage(response);
    };
    getMessage();
  }, [currentChat]);

  //post text msg to server
  const sendTextMsg = useCallback(
    async (textMsg, sender, currentChatId, setTextMsg) => {
      if (!textMsg) return console.log("Please contain a msg to send.");
      const response = await postRequest(
        `${baseUrl}/msg`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMsg,
        })
      );
      if (response.error) {
        return setSendTextMsgErr(response);
      }
      setNewMessage(response);
      setMessage((prev) => [...prev, response]);
      setTextMsg("");
    },
    []
  );

  const markAllNotiRead = useCallback((notification) => {
    const readedNoti = notification.map((n) => {
      return { ...n, isRead: true };
    });
    setNotification(readedNoti);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsErr,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        message,
        isMsgLoading,
        msgErr,
        sendTextMsg,
        onlineUsers,
        notification,
        allUser,
        markAllNotiRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
