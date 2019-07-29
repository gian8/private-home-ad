const puppeteer = require('puppeteer');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

module.exports = {
	scrap: async function (url) {
		let pagIndex = 1;
		let foundAd = [];
		const timer = 200;

		try {
			const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
			const page = await browser.newPage();

			await page.setViewport({ width: 1024, height: 600 })
			await page.waitFor(timer);
			foundAd = await pagination(url, page, pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(url, page, ++pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(url, page, ++pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(url, page, ++pagIndex, foundAd);
			await page.waitFor(timer);
			foundAd = await pagination(url, page, ++pagIndex, foundAd);
			await browser.close();
			return foundAd;
		}
		catch (e) {
			console.log('error', e);
		}
	}
}

var pagination = async function (url, page, pagIndex, foundAd) {
	const reg = /pag=([0-9]+)/gm;
	let urlIndex = url;

	if (reg.test(url)) {
		urlIndex = url.replace(/pag=([0-9]+)/gm, `pag=${pagIndex}`);
	}
	else {
		urlIndex += `&pag=${pagIndex}`
	}

	await page.goto(urlIndex);
	//await page.screenshot({ path: `visitpage/page${pagIndex}.png` });

	var news = await page.evaluate(() => {
		var adContainer = $('#listing-container');
		let privs = adContainer.find('li').not('.listing-item--tiny'); //select <li>

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