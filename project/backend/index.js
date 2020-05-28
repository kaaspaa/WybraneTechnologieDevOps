const keys = require("./keys");
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json());

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS convert_results(number BIT VARYING(50))').catch(err =>{ 
  console.log(err);
});

console.log(keys);

const convertDecimalToBinary = function(number){
  positive = true;
  var binary = "";
  let temp = number;
  if(temp <0){
    positive = false;
    temp = temp * (-1);
  }
  while(temp > 0){
    if(temp % 2 == 0){
      binary = "0" + binary;
    }
    else {
      binary = "1" + binary;
    }
    temp = Math.floor(temp / 2);
  }
  if(!positive){
    binary = "1" + binary;
  }else{
    binary = "0" + binary;
  }
  return binary;
}
app.get("/:decimal", (req, resp) => {
  const key = `${req.params.decimal}`;
  const decimal = req.params.decimal;

  if (isNaN(decimal)) {
    return resp.send({error: "Decimal number supposed to be decimal"});
  }  
  redisClient.get(key, (err, binar) => {
      if(!binar) {
        binar = convertDecimalToBinary(decimal);
        redisClient.set(key, binar);
      }
      pgClient.query('INSERT INTO convert_results(number) VALUES ($1);', [binar]).catch(err => console.log(err));
      resp.send({result: binar})
  });

});



app.get("/convert_results/", (req, resp) => {
  pgClient.query("SELECT * FROM convert_results", (err,res) => {
      if (err) {
          console.log(err.stack, res);
          resp.send('Error occured when reading from db\n'+err.stack);
      } else {
          resp.send(res.rows);
      }
  });
});

app.listen(4000,  err => {
  console.log('Example app listening on port 4000!');
});
