const express = require('express');

const redis = require('redis');

const app = express();

const process = require('process');

const client = redis.createClient({
  host: 'redis-server',
  port: 6379
});

app.get('/:fact', (req, resp) => {
  const factorialValue = req.params.fact;
  if (factorialValue > 10) {
    process.exit(1);
  };

  client.get(factorialValue, (err, result) => {
    if (err || result === null) {
      const factorialResult = countFactorialNumber(factorialValue);
      client.set(factorialValue, factorialResult);
      resp.send('Result: ' + factorialResult);
    } else {
      resp.send('Result: ' + result);
    };
  });
});

const countFactorialNumber = (number) => {
  if (number === 0) {
    return 1;
  } else {
    return number * countFactorialNumber(number - 1);
  }
}

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
