const cheerio = require("cheerio");
const request = require("request");
const express = require("express");
const router = express.Router();
const dataRest = require("../models/dataOfrest");

function cb(error, response, html) {
  if (error) {
    console.log("error:", error);
  } else {
    handlehtml(html);
  }
}

async function handlehtml(html) {
  //name

  let restaurantsName = [];

  let name$ = cheerio.load(html);
  let nameOfRestaurants = name$(".css-1pxmz4g > a");
  // console.log(nameOfRestaurants);
  for (let i = 0; i < nameOfRestaurants.length; i++) {
    let outputData = name$(nameOfRestaurants[i]).text();
    console.log(outputData);
    restaurantsName[i] = outputData;
  }

  // console.log("===============", restaurantsName, "====================");

  //image

  let imageUrls = [];

  let imageUrl$ = cheerio.load(html);
  let imageurls = imageUrl$(".css-xlzvdl");

  for (let i = 0; i < imageurls.length; i++) {
    let outputData = imageUrl$(imageurls[i]).attr("src");
    console.log(outputData);
    imageUrls[i] = outputData;
  }

  // console.log("++++++++++" , imageUrls , "++++++++++");

  //address

  let addressDetails = [];

  let address$ = cheerio.load(html);
  let restUrls = address$(".css-1pxmz4g > a");
  for (let i = 0; i < restUrls.length; i++) {
    let urls = address$(restUrls[i]).attr("href");
    let finalurl = "https://www.yelp.com" + urls;

    request(finalurl, addressCb2);

    function addressCb2(error, response, html2) {
      if (error) {
        console.log(error);
      } else {
        addressHandlehtml2(html2);
      }
    }

    async function addressHandlehtml2(html2) {
      let $2 = cheerio.load(html2);
      let address = $2(
        ".arrange-unit__373c0__2u2cR.arrange-unit-fill__373c0__3cIO5.border-color--default__373c0__2s5dW  .css-chtywg"
      );

      let finaladdress = address$(address).text();
      console.log(finaladdress);
      addressDetails[i] = finaladdress;
      // console.log(addressDetails[i]);
    }
  }

  // console.log("--------------" , addressDetails , "------------------");

  for (let i = 0; i < restaurantsName.length; i++) {
    const data = await new dataRest({
      name: restaurantsName[i],
      urlOfimage: imageUrls[i],
      aaddress: addressDetails[i],
    }).save();
  }
}

router.get("/", async (req, res, next) => {
  try {
    request("https://www.yelp.com/search?cflt=restaurants", cb);
    // console.log(html1);

    res.json("success");
  } catch (e) {
    console.log(e);
    res.status(400);
    next(e);
  }
});

module.exports = router;
