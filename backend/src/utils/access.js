const prisma = require("../prisma");

/**
 * Chat rule:
 * - Idea owner can chat
 * - A user can chat if their Interest status is ACCEPTED
 */
async function canChat({ userId, ideaId }) {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { ownerId: true },
  });

  if (!idea) return { ok: false, reason: "Idea not found" };
  if (idea.ownerId === userId) return { ok: true };

  const interest = await prisma.interest.findUnique({
    where: { userId_ideaId: { userId, ideaId } },
    select: { status: true },
  });

  if (!interest || interest.status !== "ACCEPTED") {
    return { ok: false, reason: "Not accepted for this idea" };
  }

  return { ok: true };
}

module.exports = { canChat };
