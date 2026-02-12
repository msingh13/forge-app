const express = require("express");
const { z } = require("zod");
const prisma = require("../prisma");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const { school, skill, stage, commitment } = req.query;

  const where = {};
  if (school) where.owner = { school: String(school) };
  if (stage) where.stage = String(stage);
  if (commitment) where.commitmentLevel = String(commitment);
  if (skill) where.rolesNeeded = { has: String(skill) };

  const ideas = await prisma.idea.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, school: true, program: true } },
      _count: { select: { interests: true } },
    },
  });

  return res.json({ ideas });
});

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  stage: z.enum(["IDEA", "MVP", "STARTUP"]).optional(),
  rolesNeeded: z.array(z.string().min(1)).optional(),
  commitmentLevel: z.enum(["CASUAL", "SERIOUS", "INTENSE"]).optional(),
});

router.post("/", authRequired, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const idea = await prisma.idea.create({
    data: {
      ownerId: req.user.userId,
      title: parsed.data.title,
      description: parsed.data.description,
      stage: parsed.data.stage || "IDEA",
      rolesNeeded: parsed.data.rolesNeeded || [],
      commitmentLevel: parsed.data.commitmentLevel || "CASUAL",
    },
  });

  return res.status(201).json({ idea });
});

router.get("/:id", async (req, res) => {
  const idea = await prisma.idea.findUnique({
    where: { id: req.params.id },
    include: {
      owner: { select: { id: true, name: true, school: true, program: true } },
      interests: { include: { user: { select: { id: true, name: true, school: true, skills: true } } } },
    },
  });

  if (!idea) return res.status(404).json({ error: "Idea not found" });
  return res.json({ idea });
});

module.exports = router;
