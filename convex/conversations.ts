import { ConvexError } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) throw new ConvexError("User not found");

    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      conversationMemberships?.map(async (ms) => {
        const conv = await ctx.db.get(ms.conversationId);

        if (!conv) throw new ConvexError("Conversation not found");

        return conv;
      })
    );

    return Promise.all(
      conversations.map(async (conv, index) => {
        const allConMem = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conv._id)
          )
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          id: conv.lastMessageId,
        });

        const lastSeenMessage = conversationMemberships[index].lastSeenMessage
          ? await ctx.db.get(conversationMemberships[index].lastSeenMessage!)
          : null;

        const lastSeenMessageTime = lastSeenMessage
          ? lastSeenMessage._creationTime
          : -1;

        const unseenMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conv?._id)
          )
          .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
          .filter((q) => q.neq(q.field("senderId"), currentUser._id))
          .collect();

        if (conv.isGroup)
          return {
            conversation: conv,
            lastMessage,
            unseenCount: unseenMessages.length,
          };

        const otherMemberShip = allConMem.filter(
          (mship) => mship.memberId !== currentUser._id
        )[0];

        const otherMember = await ctx.db.get(otherMemberShip.memberId);

        return {
          conversation: conv,
          otherMember,
          lastMessage,
          unseenCount: unseenMessages.length,
        };
      })
    );
  },
});

const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"messages"> | undefined;
}) => {
  if (!id) return null;

  const message = await ctx.db.get(id);

  if (!message) return null;

  const sender = await ctx.db.get(message.senderId);

  if (!sender) return null;

  const content = getMessageContent(
    message.type,
    message.content as unknown as string
  );

  return {
    content,
    sender: sender.username,
  };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    case "image":
      return "[Image]";
    case "file":
      return "[File]";
    case "call":
      return "[Call]";
    default:
      return content;
  }
};
