const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/test", (req, res) => {
  res.json("test ok");
});

// Endpoint per la scrittura del file JSON
app.post("/update", (req, res) => {
  const jsonData = req.body; // I dati JSON aggiornati inviati nella richiesta
  console.log(req.body);
  // Scrivi i dati JSON sul file
  fs.writeFile("./dataRR.json", JSON.stringify(jsonData), (err) => {
    if (err) {
      console.error(
        "Si è verificato un errore durante la scrittura del file:",
        err
      );
      res.status(500).send("Errore durante la scrittura del file");
      return;
    }
    console.log("Il file è stato aggiornato con successo.");
    res.send("File aggiornato correttamente");
  });
});

app.listen(4000);
