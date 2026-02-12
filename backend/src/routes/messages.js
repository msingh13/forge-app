const express = require("express");
const { z } = require("zod");
const prisma = require("../prisma");
const { authRequired } = require("../middleware/auth");
const { canChat } = require("../utils/access");

const router = express.Router();

router.get("/ideas/:id/messages", authRequired, async (req, res) => {
  const ideaId = req.params.id;

  const access = await canChat({ userId: req.user.userId, ideaId });
  if (!access.ok) return res.status(403).json({ error: access.reason });

  const messages = await prisma.message.findMany({
    where: { ideaId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true } } },
  });

  return res.json({ messages });
});

const sendSchema = z.object({
  content: z.string().min(1).max(2000),
});

router.post("/ideas/:id/messages", authRequired, async (req, res) => {
  const ideaId = req.params.id;

  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const access = await canChat({ userId: req.user.userId, ideaId });
  if (!access.ok) return res.status(403).json({ error: access.reason });

  const message = await prisma.message.create({
    data: {
      ideaId,
      senderId: req.user.userId,
      content: parsed.data.content,
    },
  });

  return res.status(201).json({ message });
});

module.exports = router;
