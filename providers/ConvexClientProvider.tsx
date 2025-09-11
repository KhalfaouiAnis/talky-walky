"use client"

import LoadingLogo from "@/components/shared/LoadingLogo";
import { ClerkProvider, SignedOut, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Authenticated, AuthLoading, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

type Props = {
    children: ReactNode
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

function ConvexClientProvider({ children }: Props) {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <Authenticated>{children}</Authenticated>
                <AuthLoading><LoadingLogo /></AuthLoading>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}

export default ConvexClientProvider;