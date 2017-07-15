const scraper = require('scraperjs'),
      fs = require('fs'),
      fileToWrite = 'one-list.json',
      url = 'https://en.wikipedia.org',
      linkSelector = '.mw-content-ltr ul li a',
      scrape = (page, func) => scraper.StaticScraper.create(url + page).scrape(func)

function writeFile (res) {
    fs.appendFile(fileToWrite, JSON.stringify(res, null, '\t'))
}

function getPage ($) {
    function getText() {
        const title = () => $(this).attr('title'),
              href  = () => $(this).attr('href'),
              listObj = () => ({ title: title(), href: href() }),
              getSubPage = $ => {
                  const list = $(linkSelector).map(listObj).get()
                  return { title: title(), list }
              }
        scrape(href(), getSubPage).then(writeFile)
    }
    $(linkSelector).map(getText).get()
}

scrape('/wiki/List_of_lists_of_lists', getPage)
