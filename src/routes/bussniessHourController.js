const cheerio = require("cheerio");
const request = require("request");
const express = require("express");
const router = express.Router();
const dataRest = require("../models/dataOfrest");

function cb1(error, response, html1) {
  if (error) {
    console.log("error:", error);
  } else {
    handlehtml1(html1);
  }
}

let hourslist = [];
async function handlehtml1(html1) {
  let $ = cheerio.load(html1);
  let restUrls = $(".css-1pxmz4g > a");
  for (let i = 0; i < restUrls.length; i++) {
    let urls = $(restUrls[i]).attr("href");
    let finalurl = "https://www.yelp.com" + urls;

    request(finalurl, cb2);

    function cb2(error, response, html2) {
      if (error) {
        console.log(error);
      } else {
        handlehtml2(html2);
      }
    }

    async function handlehtml2(html2) {
      let $2 = cheerio.load(html2);

      let busHour = $2(
        ".display--inline__373c0__3d-lf.margin-l1__373c0__Z_Kgf.border-color--default__373c0__2s5dW > span"
      );
      let busdata = $2(busHour).text();
      hourslist[i] = busdata;
      // console.log(busdata);
    }
  }

  for (let i = 0; i < hourslist.length; i++) {
    const data = await new dataRest({
      workhours: busdata,
    }).save();
  }
}

router.get("/", async (req, res, next) => {
  try {
    request("https://www.yelp.com/search?cflt=restaurants", cb1);
    res.json("success");
  } catch (error) {
    console.log(e);
    res.status(400);
    next(e);
  }
});

module.exports = router;
