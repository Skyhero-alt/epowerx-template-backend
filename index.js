const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const prisma = new PrismaClient();

const port = 3000;

async function retrieveClientData(clientId) {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });

  return {
    name: client.name,
    pocName: client.pocName,
    pocDesignation: client.pocDesignation,
    logoUrl: client.logoUrl,
    valuePropositionHeader: client.valuePropositionHeader,
    valuePropositionSubheader: client.valuePropositionSubheader,
    explanationText: client.explanationText,
    videoGallery: client.videoGallery,
  };
}

app.post("/clients", async (req, res) => {
  try {
    const client = await prisma.client.create({
      data: {
        name: req.body.companyName,
        pocName: req.body.pocName,
        pocDesignation: req.body.pocDesignation,
        logoUrl: req.body.logoUrl,
        valuePropositionHeader: req.body.valuePropositionHeader,
        valuePropositionSubheader: req.body.valuePropositionSubheader,
        explanationText: req.body.explanationText,
        videoGallery: req.body.videoGallery,
      },
    });
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/clients/:clientId", async (req, res) => {
  const clientId = Number(req.params.clientId);
  const clientData = await retrieveClientData(clientId);

  res.json(clientData);
});

app.get("/my-protected-page", (req, res) => {
  const userIp = req.ip;
  const allowedIp = `::ffff:${env(IP)}`;

  if (userIp == allowedIp) {
    res.send({ comp: "<FormPage />", ip: req.ip });
  } else {
    res.send({ comp: "<NotAllowed />", ip: req.ip });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
