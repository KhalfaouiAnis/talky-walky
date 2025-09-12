"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import DMConversationItem from "./_components/DMConversationItem";

export default function ConversationsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const conversations = useQuery(api.conversations.get);

    return (
        <>
            <ItemList title="Conversations">
                {
                    conversations ? conversations.length === 0 ?
                        <p className="w-full h-full flex items-center justify-center">No conversations</p>
                        : conversations.map(convs => {
                            return convs.conversation.isGroup ?
                                null
                                : <DMConversationItem
                                    key={convs.conversation._id}
                                    id={convs.conversation._id}
                                    username={convs.otherMember?.username || ""}
                                    imageUrl={convs.otherMember?.imageUrl || ""}
                                    lastMessageContent={convs.lastMessage?.content}
                                    lastMessageSender={convs.lastMessage?.sender}
                                />
                        })
                        : <Loader2 />
                }
            </ItemList>
            {children}
        </>
    );
}
