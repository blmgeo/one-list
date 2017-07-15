const scraper = require('scraperjs'),
    fs = require('fs'),
    fileToWrite = 'one-list.json',
    url = 'https://en.wikipedia.org',
    linkSelector = '.mw-content-ltr ul li a',
    scrape = (page, func) => scraper.StaticScraper.create(url + page).scrape(func),
    writeFile = res => {
        fs.appendFile(fileToWrite, JSON.stringify(res, null, '\t'))
    }

scrape('/wiki/List_of_lists_of_lists', function($) {
    function getText() {
        const title = $(this).attr('title')
        scrape($(this).attr('href'), function() {
            const list = $(linkSelector).map(function() {
                return {title: $(this).attr('title'), href: $(this).attr('href')}
            }).get()
            return {title, list}
        }).then(writeFile)
    }
    $(linkSelector).map(getText).get()
})
