import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

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

        if (conv.isGroup) return { conversation: conv };

        const otherMemberShip = allConMem.filter(
          (mship) => mship.memberId !== currentUser._id
        )[0];

        const otherMember = await ctx.db.get(otherMemberShip.memberId);

        return {
          conversation: conv,
          otherMember,
        };
      })
    );
  },
});
