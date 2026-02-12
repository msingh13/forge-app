const express = require("express");
const prisma = require("../prisma");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

// Express interest in an idea
router.post("/ideas/:id/interests", authRequired, async (req, res) => {
  const ideaId = req.params.id;

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) return res.status(404).json({ error: "Idea not found" });

  if (idea.ownerId === req.user.userId) {
    return res.status(400).json({ error: "Owner cannot interest their own idea" });
  }

  try {
    const interest = await prisma.interest.create({
      data: { ideaId, userId: req.user.userId },
    });
    return res.status(201).json({ interest });
  } catch {
    return res.status(409).json({ error: "Already expressed interest" });
  }
});

// Owner: list interests for their idea
router.get("/ideas/:id/interests", authRequired, async (req, res) => {
  const ideaId = req.params.id;

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) return res.status(404).json({ error: "Idea not found" });
  if (idea.ownerId !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

  const interests = await prisma.interest.findMany({
    where: { ideaId },
    include: { user: { select: { id: true, name: true, school: true, skills: true } } },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ interests });
});

// Owner: accept/reject an interest
router.patch("/interests/:interestId", authRequired, async (req, res) => {
  const { interestId } = req.params;
  const { status } = req.body; // "ACCEPTED" | "REJECTED"

  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const interest = await prisma.interest.findUnique({
    where: { id: interestId },
    include: { idea: true },
  });

  if (!interest) return res.status(404).json({ error: "Interest not found" });
  if (interest.idea.ownerId !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

  const updated = await prisma.interest.update({
    where: { id: interestId },
    data: { status },
  });

  return res.json({ interest: updated });
});

module.exports = router;
