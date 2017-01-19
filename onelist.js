#!/usr/bin/env node
const scraper = require('scraperjs'),
fs = require('fs')

const fileToWrite = 'one-list.json'

//scrape the initial Lists of lists of lists page for links
scraper
.StaticScraper
.create('https://en.wikipedia.org/wiki/List_of_lists_of_lists')
.scrape(function ($) {

  const getText = function () {
    let title = $(this).attr('title')
    //scrape page of each list link
    scraper
    .StaticScraper
    .create('https://en.wikipedia.org' + $(this).attr('href'))
    .scrape(function ($) {
      let list = $('.mw-content-ltr ul li a').map(function () {
        return {
          title: $(this).attr('title'),
          href: $(this).attr('href')
        }
      }).get()
      return { title, list }
    })
    .then(function (res) {
      fs.appendFile(fileToWrite, JSON.stringify(res, null, '\t'))
    })
  }
  let lists = $('.mw-content-ltr ul li a').map(getText).get()
})