const express = require("express");
const https = require("https");
const ejs = require("ejs");
const Country = require("./Country").Country;

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/static"));

app.listen(3000, () => {
  console.log("server up and running");
});

let countries = [];

app.get("/", (_, res) => {
  res.render("index", {Countries : countries});
});


app.post("/", (request, res) => {

  region = request.body.region;
  filter = request.body.filter;


  const url = "https://restcountries.com/v3.1/name/" + filter;
  const url_region = "https://restcountries.com/v3.1/region/" + region;

  let uRl = url_region;

  if(filter !== undefined || region === undefined) {
    uRl = url
  }
  
    https.get( uRl , (response) => {
            let result = "";
            let co = []
            console.log("Search invoked")
      
            response.on("data", (data) => {
              result += data;
            });
      
            response.on("end", async () => {
              const Data = JSON.parse(result);
              
              await Data.forEach((c) => {
                let count = new Country(
                  c.name.common,
                  c.population,
                  c.region,
                  c.capital,
                  c.flags.png,
                  c.name.official,
                  c.subregion,
                  c.topLevelDomain,
                  c.currencies,
                  c.languages,
                  c.borders
                );
                co.push(count);
              });
              countries = co
              res.redirect("/");
              
            });
          });
});

app.get("/:topic", (req, res) => {
  countries.forEach((country) => {
    if(req.params.topic === country.name){
      res.render("details", { details: country});
      console.log("condition matched")
    } 
  });
});
