import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
  const { name } = req.query;
  const where = {};
  if (name) {
    where.name = { contains: name, mode: "insensitive" };
  }
  const users = await prisma.user.findMany({ where });

  res.status(200).json(users);
});

app.post("/users", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (user) {
    return res.status(409).send("Email já cadastrado!");
  }

  const userCreate = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(userCreate);
});

app.put("/users/:id", async (req, res) => {
  const user = await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(200).json(user);
});

app.delete("/users/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).send();
});

app.listen(3200, () => {
  console.log("Aplicação iniciada na porta (3200)");
});

// user mongoDB : luizhenrique
// password: paçoquinha123
