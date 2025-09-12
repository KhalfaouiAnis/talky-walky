"use client";

import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import MessageActionsPopover from "./MessageActionsPopover";
import { useTheme } from "next-themes";
import EmojiPicker, { Theme } from "emoji-picker-react";

const chatMessageSchema = z.object({
    content: z.string().min(1, "This field can't be empty")
})

function ChatInput() {
    // eslint-disable-next-line
    const emojiPickerRef = useRef<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);

    const { conversationId } = useConversation();

    const { theme } = useTheme();

    const { mutate: createMessage, pending } = useMutationState(api.message.create)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) setEmojiPickerOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const form = useForm<z.infer<typeof chatMessageSchema>>({
        resolver: zodResolver(chatMessageSchema),
        defaultValues: { content: "" }
    })

    const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
        createMessage({
            conversationId,
            type: "text",
            content: [values.content]
        }).then(() => {
            form.reset()
            textareaRef.current?.focus();
        })
            .catch(err => toast.error(err instanceof ConvexError ? err.data : "Unexpected error occurred"))
    }

    // eslint-disable-next-line
    const handleInputChange = (event: any) => {
        const { value, selectionStart } = event.target;
        if (selectionStart !== null) {
            form.setValue("content", value);
            setCursorPosition(selectionStart);
        }
    };

    const content = form.watch("content");

    const insertEmoji = (emoji: string) => {
        const newText = [
            content.substring(0, cursorPosition),
            emoji,
            content.substring(cursorPosition),
        ].join("");

        form.setValue("content", newText);

        setCursorPosition(cursorPosition + emoji.length);
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            await form.handleSubmit(handleSubmit)()
        }
    }

    return (
        <Card className="w-full rounded-lg p-2 relative">
            <div className="absolute bottom-16" ref={emojiPickerRef}>
                <EmojiPicker
                    open={emojiPickerOpen}
                    theme={theme as Theme}
                    lazyLoadEmojis
                    onEmojiClick={(emojiDetails) => {
                        insertEmoji(emojiDetails.emoji);
                        setEmojiPickerOpen(false);
                    }}
                />
            </div>
            <div className="flex gap-2 items-end w-full">
                <MessageActionsPopover setEmojiPickerOpen={setEmojiPickerOpen} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2 items-end w-full">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="h-full w-full">
                                    <FormControl>
                                        <TextareaAutosize
                                            rows={1}
                                            maxRows={3}
                                            {...field}
                                            onChange={handleInputChange}
                                            // onClick={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type a message"
                                            className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={pending} size="icon" type="submit"><SendHorizonal /></Button>
                    </form>
                </Form>
            </div>
        </Card>
    );
}

export default ChatInput;