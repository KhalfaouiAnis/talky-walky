"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import Message from "./Message";

function Body() {
    const { conversationId } = useConversation()
    const messages = useQuery(api.messages.get, {
        id: conversationId as Id<"conversations">
    })

    return (
        <div className="w-full flex flex-1 overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
            {messages?.map(({ message, isCurrentUser, senderImage, senderName }, index) => {
                const lastByUser = messages[index - 1]?.message.senderId === messages[index].message.senderId
                return <Message
                    key={message._id}
                    fromCurrentUser={isCurrentUser}
                    senderImage={senderImage} senderName={senderName}
                    lastByUser={lastByUser} content={message.content}
                    createdAt={message._creationTime} type={message.type}
                />
            })}
        </div>
    );
}

export default Body;