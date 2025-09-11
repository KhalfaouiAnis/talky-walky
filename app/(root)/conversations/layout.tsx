import ItemList from "@/components/shared/item-list/ItemList";

export default function ConversationsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ItemList title="Conversations">Conversations</ItemList>
            {children}
        </>
    );
}
