const fetch = require("node-fetch");
const convert = require('xml-js');

// перед парсингом берём ссылку из 1го элемента XML файла Yandex Feed по адресу <sitename>/all-news.xml
module.exports = async function (url) {
    let response = await fetch(`${url}/all-news.xml`)
        .then(response => response.status === 200 ? response.text() : null)
    
    if (!response) {
        return ''
        // throw new Error('не удалось получить данные о последнем посте из Feed ленты');
    }
    
    let xmlObject = convert.xml2js(response, {compact: true})
    return xmlObject.rss.channel.item[2].link._text
}