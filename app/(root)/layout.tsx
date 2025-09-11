import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarWrapper>{children}</SidebarWrapper>
    );
}
