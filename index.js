import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
const port = 3000;
const API_URL = "https://pokeapi.co/api/v2/pokemon/"




app.get("/", (req, res) => {
    res.render("index.ejs", { content: "API Response." });
  });
  
  app.get("/", async (req, res) => {
    try {
      const result = await axios.get(API_URL + "/random");
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.status(404).send(error.message);
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  