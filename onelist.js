const scraper = require('scraperjs')
const fs = require('fs')
const fileToWrite = 'one-list.json'
const url = 'https://en.wikipedia.org'
const selector = '.mw-content-ltr ul li a'
const s = scraper.StaticScraper.create

s(url + '/wiki/List_of_lists_of_lists').scrape(function($) {
  const getText = function () {
    const title = $(this).attr('title')
    const href = $(this).attr('href')

    s(url + href).scrape(function($) {
      let list = $(selector).map(function() {
        return {
          title: $(this).attr('title'),
          href: $(this).attr('href')
        }
      }).get()

      return { title, list }
    })
    .then(function(res) {
      fs.appendFile(fileToWrite, JSON.stringify(res, null, '\t'))
    })
  }

  let lists = $(selector).map(getText).get()
})