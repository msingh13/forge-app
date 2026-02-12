const express = require("express");
const { z } = require("zod");
const prisma = require("../prisma");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
      school: true,
      program: true,
      skills: true,
      experienceLevel: true,
      lookingFor: true,
      createdAt: true,
    },
  });

  return res.json({ user });
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  school: z.string().min(2).optional(),
  program: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  lookingFor: z.enum(["IDEA", "TEAM", "BOTH"]).optional(),
});

router.patch("/me", authRequired, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: parsed.data,
    select: {
      id: true,
      name: true,
      email: true,
      school: true,
      program: true,
      skills: true,
      experienceLevel: true,
      lookingFor: true,
    },
  });

  return res.json({ user });
});

module.exports = router;
