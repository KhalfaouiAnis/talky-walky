"use client"

import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
    const router = useRouter();
    router.push("/conversations")

    useEffect(() => { }, [error, router])

    return <ConversationFallback />
}