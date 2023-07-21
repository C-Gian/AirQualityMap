const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://C-Gian:Ilch6nXYInRgrYaN@cluster0.9prw9gg.mongodb.net/?retryWrites=true&w=majority";
const dbName = "7daysdata";
//Ilch6nXYInRgrYaN

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/is-daily-update-done", async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("connection mongodb for /is-daily-update-done successfull");

    // Seleziona il database
    const db = client.db(dbName);

    // Seleziona la collezione
    const collection = db.collection("checkUpdate");

    // Trova l'unico oggetto presente nella collezione
    const object = await collection.findOne();

    if (object) {
      if (object.todayDate) {
        res.send(true);
      } else {
        res.send(false);
      }
    }

    /* const { todayDate, updated } = req.body;
    
    // Inserimento del JSON nella collezione
    await collection.insertOne({ todayDate: updated });
    console.log("Dati inseriti correttamente nella collezione.");

    // Chiudi la connessione a MongoDB
    client.close();
    console.log("Connessione chiusa correttamente."); */
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    // Invia una risposta al client con un messaggio di errore
    res
      .status(500)
      .send("Si è verificato un errore durante l'inserimento dei dati.");
  }
});

app.post("/daily-update", async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("connection mongodb for /daily-update successfull");
    const { dataToUpdate } = req.body;
    const db = client.db(dbName);
    await db.collection("day7").deleteMany({});
    await db.collection("day7").insertOne(dataToUpdate);
    await db.collection("day7").rename("day0");
    await db.collection("day6").rename("day7");
    await db.collection("day5").rename("day6");
    await db.collection("day4").rename("day5");
    await db.collection("day3").rename("day4");
    await db.collection("day2").rename("day3");
    await db.collection("day1").rename("day2");
    await db.collection("day0").rename("day1");
    const object = await db.collection("checkUpdate").findOne();
    object.todayDate = true;
    await db.collection("checkUpdate").deleteMany({});
    await db.collection("checkUpdate").insertOne(object);
    console.log("Update Done");
    res.send(true);
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    // Invia una risposta al client con un messaggio di errore
    res.status(500).send(false);
  }
});

app.get("/datas", async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("connection mongodb for /datas successfull");
    const db = client.db(dbName);
    const collections = [
      "day1",
      "day2",
      "day3",
      "day4",
      "day5",
      "day6",
      "day7",
    ];
    let datas = [];
    for (let i = 0; i < collections.length; i++) {
      const collection = db.collection(collections[i]);
      const object = await collection.findOne();
      datas.push(object);
    }
    res.json(datas);
  } catch (error) {}
});

// Endpoint per la scrittura del file JSON
app.post("/update", (req, res) => {
  const jsonData = req.body; // I dati JSON aggiornati inviati nella richiesta
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
