const express = require("express");

const app = express();
const port = 5000;

app.listen(5000, () => {
  console.log(`Server is run on port ${port}...`);
});

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

app.get("/", (req, res) => {
  res.send("Hello world!");
});

//////////////////

app.get("*", function(req, res) {

  let unix = convertToUnix( req.url );
  let natural = convertToNatural( req.url );

  if ( unix ) {
    natural = convertToNatural( unix );
  } else if ( natural ) {
    unix = convertToUnix( natural );
  }

  let r = {
    "unix": unix,
    "natural": natural
  };
  res.send( JSON.stringify( r ) );
});

function strToMonth(name) {
  let res = null;
  for (let i = 0; i < MONTHS.length; i++) {
    if (name === MONTHS[i]) {
      res = i + 1;
      break;
    }
  }
  return res;
}

function convertToNatural(str) {
  if (str) {
    let arr = cleanString(str);

    if (!isNaN(arr[0])) {
      if (arr.length === 1) {
        let date = new Date( Number(arr[0]) * 1000 );

        return MONTHS[date.getMonth()] + ' ' + date.getUTCDate() + ', ' + date.getFullYear();
      }
    }
  }
  return null;
}

function cleanString(str) {
  str = str.toString().replace( /\/|\,/g, '' );
  str = str.toString().replace( /%20/g, ' ' );

  return str.split(' ');
}

function convertToUnix(str) {
  if ( str ) {
    let arr = cleanString(str);

    if (arr.length === 3) {
      let u = arr[2] + "." + strToMonth(arr[0]) + "." + arr[1];
      u = (new Date(u).getTime() / 1000).toFixed(0);
      return Number(u);
    }
  }
  return null;
}
