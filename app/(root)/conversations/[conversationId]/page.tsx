"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useState } from "react";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";
import { useParams } from "next/navigation";


function ConversationPage() {
    const { conversationId } = useParams();

    const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false)
    const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
    const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false)
    const [callType, setCallType] = useState<"audio" | "video" | null>(null)

    const conversation = useQuery(api.conversation.get, {
        id: conversationId as Id<"conversations">
    })

    return (
        conversation === undefined
            ? <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8" /></div>
            : conversation === null ? <div className="w-full h-full flex items-center justify-center">Conversation not found</div>
                : <ConversationContainer>
                    <RemoveFriendDialog
                        conversationId={conversationId as Id<"conversations">}
                        open={removeFriendDialogOpen}
                        setOpen={setRemoveFriendDialogOpen}
                    />
                    <Header
                        imageUrl={conversation.isGroup ? undefined : conversation.otherMember.imageUrl}
                        name={(conversation.isGroup ? conversation.name : conversation.otherMember.username) || ""}
                        options={conversation.isGroup ? [
                            { label: 'Leave group', destructive: true, onClick: () => setLeaveGroupDialogOpen(true) },
                            { label: 'Delete group', destructive: true, onClick: () => setDeleteGroupDialogOpen(true) },
                        ] : [
                            { label: 'Remove friend', destructive: true, onClick: () => setRemoveFriendDialogOpen(true) },
                        ]}
                    />
                    <Body />
                    <ChatInput />
                </ConversationContainer>
    );
}

export default ConversationPage;