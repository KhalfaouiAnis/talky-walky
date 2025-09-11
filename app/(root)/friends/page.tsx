"use client";

import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import AddFriendDialog from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import Request from "./_components/Request";

function FriendsPage() {
    const requests = useQuery(api.requests.get);

    return (
        <>
            <ItemList title="Friends" action={<AddFriendDialog />}>
                {
                    requests ? requests.length === 0 ?
                        <p className="w-full h-full flex items-center justify-center">No friend requests</p>
                        : requests.map(({ request, sender, }) => <Request
                            key={request._id}
                            id={request._id}
                            imageUrl={sender.imageUrl}
                            username={sender.username}
                            email={sender.email}
                        />)
                        : <Loader2 className="h-8 w-8" />
                }
            </ItemList>
            <ConversationFallback />
        </>
    );
}

export default FriendsPage;