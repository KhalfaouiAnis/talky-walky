"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import DMConversationItem from "./_components/DMConversationItem";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import GroupConversationItem from "./_components/GroupConversationItem";

export default function ConversationsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const conversations = useQuery(api.conversations.get);

    return (
        <>
            <ItemList title="Conversations" action={<CreateGroupDialog />}>
                {
                    conversations ? conversations.length === 0 ?
                        <p className="w-full h-full flex items-center justify-center">No conversations</p>
                        : conversations.map(convs => {
                            return convs.conversation.isGroup ?
                                <GroupConversationItem
                                    key={convs.conversation._id}
                                    id={convs.conversation._id}
                                    name={convs.otherMember?.username || ""}
                                    lastMessageContent={convs.lastMessage?.content}
                                    lastMessageSender={convs.lastMessage?.sender}
                                    unseenCount={convs.unseenCount}
                                /> : <DMConversationItem
                                    key={convs.conversation._id}
                                    id={convs.conversation._id}
                                    username={convs.otherMember?.username || ""}
                                    imageUrl={convs.otherMember?.imageUrl || ""}
                                    lastMessageContent={convs.lastMessage?.content}
                                    lastMessageSender={convs.lastMessage?.sender}
                                    unseenCount={convs.unseenCount}
                                />
                        })
                        : <Loader2 />
                }
            </ItemList>
            {children}
        </>
    );
}
