import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) throw new ConvexError("User not found");

    const conversation = await ctx.db.get(args.id);

    if (!conversation) throw new ConvexError("Conversation not found");

    const memberShip = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!memberShip)
      throw new ConvexError("Your are not member of this conversation");

    const allConvMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMemberShip = allConvMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];
      const otherMeberDetails = await ctx.db.get(otherMemberShip.memberId);

      return {
        ...conversation,
        otherMember: {
          ...otherMeberDetails,
          lastSeenMessageId: otherMemberShip.lastSeenMessage,
        },
        otherMembers: null,
      };
    }
  },
});
