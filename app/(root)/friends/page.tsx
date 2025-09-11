import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/ItemList";

function FriendsPage() {
    return (
        <>
            <ItemList title="Friends">
                Friends page
            </ItemList>
            <ConversationFallback />
        </>
    );
}

export default FriendsPage;