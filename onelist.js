const scraper = require('scraperjs');
const fs = require('fs');

const fileToWrite = 'one-list.json';
const url = 'https://en.wikipedia.org';
const linkSelector = '.mw-content-ltr ul li a';
const scrape = (page, func) => scraper.StaticScraper.create(url + page).scrape(func);
const writeFile = res => fs.appendFile(fileToWrite, JSON.stringify(res, null, '\t'));

scrape('/wiki/List_of_lists_of_lists', ($) => {
  const getText = function getText() {
    const title = $(this).attr('title');
    scrape($(this).attr('href'), () => {
      const list = $(linkSelector).map(function listObj() {
        return { title: $(this).attr('title'), href: $(this).attr('href') };
      }).get();
      return { title, list };
    }).then(writeFile);
  };
  $(linkSelector).map(getText).get();
});
