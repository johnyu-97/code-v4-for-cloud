import { useContext } from "react";
import { ChatContext } from "../context/ChatContext"
import { Container, Stack, } from "react-bootstrap"
import ChatCard from "../components/chat/ChatCard";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChat";
import ChatBox from "../components/chat/ChatBox";


const Chat = () => {
    const { user } = useContext(AuthContext)
    const {
        userChats,
        userChatsErr,
        isUserChatsLoading,
        updateCurrentChat } = useContext(ChatContext);

    return (<Container>
        <PotentialChats />
        {userChats?.length < 1 ? null :
            <Stack direction="horizontal" gap={3} className="align-items-start">
                <Stack className="message-box flex-grow-0" gap={3}>
                    {isUserChatsLoading && <p>Loading Chat List</p>}
                    {userChats?.map((chat, index) => {
                        return (
                            <div key={index} onClick={()=>updateCurrentChat(chat)}>
                                <ChatCard chat={chat} user={user} />
                            </div>)
                    })}

                </Stack>
                <ChatBox/>
            </Stack>}

    </Container>);
}

export default Chat;