const puppeteer = require('puppeteer');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

module.exports = {
	example: async function () {
		let pagIndex = 1;
		let foundAd = [];
		const timer = 200;

		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.setViewport({ width: 1024, height: 600 })
			await page.waitFor(timer);
			foundAd = await pagination(page, pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(page, ++pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(page, ++pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(page, ++pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(page, ++pagIndex, foundAd);
			await browser.close();
			return foundAd;
		}
		catch (e) {
			console.log('error', e);
		}
	}
}

var pagination = async function (page, pagIndex, foundAd) {
	await page.goto(`https://www.immobiliare.it/ricerca.php?idCategoria=1&idContratto=2&idTipologia=&sottotipologia=&idTipologiaStanza=&idFasciaPrezzo=&idNazione=IT&idRegione=&idProvincia=&idComune=&idLocalita=&idAreaGeografica=&prezzoMinimo=&prezzoMassimo=500&balcone=&balconeOterrazzo=&boxOpostoauto=&stato=&terrazzo=&bagni=&mappa=&foto=&superficie=&superficieMinima=40&superficieMassima=&raggio=&locali=&localiMinimo=&localiMassimo=&criterio=dataModifica&ordine=desc&map=0&tipoProprieta=&arredato=&inAsta=&noAste=&aReddito=&fumatore=&animali=&franchising=&flagNc=&gayfriendly=&internet=&sessoInquilini=&vacanze=&categoriaStanza=&fkTipologiaStanza=&ascensore=&classeEnergetica=&verticaleAste=&occupazioneInquilini=&pag=${pagIndex}&vrt=45.080090736644%2C7.656063080358%3B45.065567558843%2C7.631996155833%3B45.057443637863%2C7.638519288157%3B45.052835527869%2C7.64229583845%3B45.050410057671%2C7.653453827952%3B45.049682396554%2C7.681949616526%3B45.059383783612%2C7.687271119212%3B45.070174642796%2C7.675769806956%3B45.077569448459%2C7.66821670637`);
	//await page.screenshot({ path: `visitpage/page${pagIndex}.png` });

	var news = await page.evaluate(() => {
		var adContainer = $('#listing-container');
		let privs = adContainer.find('li').not('.listing-item--tiny'); //devo prendere i li


		let privateItems = privs.find('.listing-item_body > .listing-item_body--content > .titolo > a');
		let costs = privs.find('.lif__pricing');
		var titleLinkArray = [];
		for (var i = 0; i < privateItems.length; i++) {
			titleLinkArray[i] = {
				title: privateItems[i].innerText.trim(),
				link: privateItems[i].getAttribute("href"),
				price: costs[i].innerText.trim()
			};
		}
		return titleLinkArray;
	});

	return foundAd.concat(news);
}