const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
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
let client;
connectToDatabase();

app.get("/is-daily-update-done", async (req, res) => {
  try {
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

app.post("/daily-bulk-update", async (req, res) => {
  try {
    const { todayBulkData } = req.body;
    const db = client.db(dbName);
    const collection = db.collection("bulkdata");
    const previousBulkData = await collection.findOne();
    if (previousBulkData) {
      const number = Object.keys(previousBulkData.data).length + 1;
      previousBulkData.data[number] = todayBulkData;
      await collection.deleteMany({});
      await collection.insertOne(previousBulkData);
      console.log("Bulk Update Done");
      res.send(true);
    } else {
      console.log("Bulk Update Error");
      res.status(500).send(false);
    }
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    res.status(500).send(false);
  }
});

app.post("/daily-dots-update", async (req, res) => {
  try {
    const { todayDots } = req.body;
    const db = client.db(dbName);
    const collection = db.collection("dotsdata");
    /* await collection.deleteMany({});
    await collection.insertOne({
      data: {
        1: todayDots,
        2: todayDots,
        3: todayDots,
        4: todayDots,
        5: todayDots,
        6: todayDots,
        7: todayDots,
      },
    }); */
    const previousDotsData = await collection.findOne();
    if (previousDotsData) {
      previousDotsData.data["7"] = previousDotsData.data["6"];
      previousDotsData.data["6"] = previousDotsData.data["5"];
      previousDotsData.data["5"] = previousDotsData.data["4"];
      previousDotsData.data["4"] = previousDotsData.data["3"];
      previousDotsData.data["3"] = previousDotsData.data["2"];
      previousDotsData.data["2"] = previousDotsData.data["1"];
      previousDotsData.data["1"] = todayDots;
      await collection.deleteMany({});
      await collection.insertOne(previousDotsData);
      console.log("Dots Update Done");
      res.send(true);
    } else {
      console.log("Dots Update Error");
      res.status(500).send(false);
    }
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    res.status(500).send(false);
  }
});

app.post("/daily-update", async (req, res) => {
  try {
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

app.get("/bulk-datas", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("bulkdata");
    const bulkData = await collection.findOne();
    if (bulkData) {
      res.json(bulkData);
    } else {
      res.status(500).send(false);
    }
  } catch (error) {}
});

app.get("/daily-wind-update", async (req, res) => {
  console.log("getting wind datas");
  const opendapURL =
    //"https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?dir=%2Fgfs.20230814%2F06%2Fatmos&file=gfs.t06z.pgrb2.1p00.anl&all_var=on&lev_10_m_above_ground=on";
    "https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/json/wind.json";
  try {
    fetch(opendapURL)
      .then((res) => res.json())
      .then((data) => {
        res.json(data);
      });
  } catch (error) {
    console.error("Errore nel recupero dei dati:", error);
  }
});

app.get("/dots-datas", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("dotsdata");
    const dotsdata = await collection.findOne();
    if (dotsdata) {
      res.json(dotsdata);
    } else {
      res.status(500).send(false);
    }
  } catch (error) {}
});

//endpoint to get datas from mongo and send to react
app.get("/datas", async (req, res) => {
  try {
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

/* //endpoint to get daily datas from API
app.get("/get-daily-datas", async (req, res) => {
  try {
    let data = [];
    const d1 = await getFirstUS();
    d1.forEach((measurement) => {
      data.push(measurement);
    });
    const d2 = await getSecondUS();
    d2.forEach((measurement) => {
      data.push(measurement);
    });
    const d3 = await getThirdUS();
    d3.forEach((measurement) => {
      data.push(measurement);
    });
    const d4 = await getFourthUS();
    d4.forEach((measurement) => {
      data.push(measurement);
    });
    const d5 = await getFifthUS();
    d5.forEach((measurement) => {
      data.push(measurement);
    });
    res.json(data);
  } catch (error) {}
}); */

//endpoint to get daily datas from API
app.get("/get-daily-datas", async (req, res) => {
  try {
    const boundingBoxes = [
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-125.525950,26.165337,-103.729075,47.554315&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A",
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-103.729075,26.749853,-86.150950,47.282452&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A",
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-85.799388,27.152772,-67.166575,47.111827&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A",
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-166.440506,59.326006,-140.073318,71.169033&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A",
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-160.220000,18.910000,-154.800000,20.320000&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A",
    ];

    const promises = boundingBoxes.map((url) =>
      fetch(url).then((response) => response.json())
    );
    const responses = await Promise.all(promises);
    res.json(responses);
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

app.post("/singleUpdateForTest", async (req, res) => {
  try {
    const { dataR } = req.body;
    const db = client.db(dbName);
    await db.collection("day1").insertOne(dataR);
    console.log("Single update for test done");
    res.send(true);
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    res.status(500).send(false);
  }
});

app.post("/multipleUpdateForTest", async (req, res) => {
  try {
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
    for (let i = 0; i < collections.length; i++) {
      const collection = db.collection(collections[i]);
      const object = await collection.findOne();
      await collection.deleteMany({});
      const objToAdd = {
        type: "Country",
        data: {
          countryAQI: null,
          weather: null,
        },
      };
      console.log();
      object.features = object.features.unshift(objToAdd);
      await collection.insertOne(object);
      console.log(collections[i] + " multiple test done");
    }
    console.log("multiple test done");
    res.send(true);
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    res.status(500).send(false);
  }
});

app.post("/multipleAddForTest", async (req, res) => {
  try {
    const db = client.db(dbName);
    const { datasBackup } = req.body;
    const d1 = datasBackup[0];
    const d2 = datasBackup[1];
    const d3 = datasBackup[2];
    const d4 = datasBackup[3];
    const d5 = datasBackup[4];
    const d6 = datasBackup[5];
    const d7 = datasBackup[6];
    const collections = [
      "day1",
      "day2",
      "day3",
      "day4",
      "day5",
      "day6",
      "day7",
    ];
    for (let i = 0; i < collections.length; i++) {
      const collection = db.collection(collections[i]);
      await collection.deleteMany({});
      switch (i) {
        case 0:
          await collection.insertOne(d1);
          break;
        case 1:
          await collection.insertOne(d2);
          break;
        case 2:
          await collection.insertOne(d3);
          break;
        case 3:
          await collection.insertOne(d4);
          break;
        case 4:
          await collection.insertOne(d5);
          break;
        case 5:
          await collection.insertOne(d6);
          break;
        case 6:
          await collection.insertOne(d7);
          break;
      }
      console.log("day " + i + " backup restored");
    }
    console.log("all datas days backup restored");
    res.send(true);
  } catch (error) {
    console.error("Errore durante la connessione o l'inserimento:", error);
    res.status(500).send(false);
  }
});

async function getFirstUS() {
  const apiURL =
    "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-125.525950,26.165337,-103.729075,47.554315&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
  /* const apiURL =
    "https://www.airnowapi.org/aq/data/?startDate=2023-07-15T10&endDate=2023-07-15T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-125.525950,26.165337,-103.729075,47.554315&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
   */
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("first data US got correctly");
    return data;
  } catch (error) {
    console.log("error fetching first US data", error);
    return null;
  }
}
async function getSecondUS() {
  /* const apiURL =
    "https://www.airnowapi.org/aq/data/?startDate=2023-07-15T10&endDate=2023-07-15T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX= -94.46,24.39,-66.93,49.38&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
   */
  const apiURL =
    "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-103.729075,26.749853,-86.150950,47.282452&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("second data US got correctly");
    return data;
  } catch (error) {
    console.log("error fetching second US data", error);
    return null;
  }
}
async function getThirdUS() {
  const apiURL =
    "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-85.799388,27.152772,-67.166575,47.111827&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("third data US got correctly");
    return data;
  } catch (error) {
    console.log("error fetching third US data", error);
    return null;
  }
}
async function getFourthUS() {
  //alaska
  const apiURL =
    "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-166.440506,59.326006,-140.073318,71.169033&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("fourth data US got correctly");
    return data;
  } catch (error) {
    console.log("error fetching fourth US data", error);
    return null;
  }
}
async function getFifthUS() {
  //hawaii
  const apiURL =
    "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-160.220000,18.910000,-154.800000,20.320000&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("fifth data US got correctly");
    return data;
  } catch (error) {
    console.log("error fetching fifth US data", error);
    return null;
  }
}

/* const API_INTERVAL = 20 * 1000; //2 * 60 * 1000; // 2 minuti in millisecondi

// Funzione per eseguire la richiesta API
const makeApiRequest = async () => {
  try {
    // Effettua la chiamata API qui
    console.log("Dati ottenuti");

    // Pianifica la prossima richiesta API
    setTimeout(makeApiRequest, API_INTERVAL);
  } catch (error) {
    console.error("Errore durante la richiesta API:", error);
    setTimeout(makeApiRequest, API_INTERVAL);
  }
};

makeApiRequest(); */

async function connectToDatabase() {
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Errore durante la connessione al database:", error);
    throw error;
  }
}

app.listen(4000);
