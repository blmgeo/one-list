const scraper = require('scraperjs')
const fs = require('fs')

const fileToWrite = 'one-list.json'

scraper.StaticScraper.create('https://en.wikipedia.org/wiki/List_of_lists_of_lists').scrape(function ($) {
  return $('.mw-content-ltr ul li a').map(function () {
    const title = $(this).attr('title')
    scraper.StaticScraper.create('https://en.wikipedia.org' + $(this).attr('href')).scrape(function (_) {
      return _('.mw-content-ltr ul li a').map(function () {
        return { title: _(this).attr('title'), href: _(this).attr('href') }
      }).get()
    }).then(function (res) {
      fs.appendFile(fileToWrite, JSON.stringify(res, null, '\t'))
    })
  }).get()
})
