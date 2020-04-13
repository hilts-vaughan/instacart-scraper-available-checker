#!/usr/bin/env node
const argv = require('yargs').argv
const puppeteer = require('puppeteer');

const username = argv.username;
const password = argv.pw;
const postal = argv.postal || 'N2H 2H1';

console.log(`Username: ${username}`);

// main function
const getStatus = async () => {
    const browser = await puppeteer.launch({
        headless: true
    })
    const page = await browser.newPage()

    const navigationPromise = page.waitForNavigation()

    await page.goto('https://www.instacart.ca/')

    await page.setViewport({ width: 2560, height: 1309 })

    // Go through the postal code thing fast
    const postalCodeSelector = '#root form div > input';
    await page.waitForSelector(postalCodeSelector, { visible: true });
    await page.click(postalCodeSelector);
    await page.type(postalCodeSelector, postal);

    const $loginButton = '#main-content form div > button[type="submit"]';
    await page.waitForSelector($loginButton)
    await page.click($loginButton)

    // Click sign up now
    await page.waitForSelector('#main-content form > p:nth-child(11) > span > a');
    await page.click('#main-content form > p:nth-child(11) > span > a');

    console.log('Logging into Instacart...');

    // Click username
    const $username = '#nextgen-authenticate\\.all\\.log_in_email';
    await page.waitForSelector($username)
    await page.click($username)
    await page.type($username, username);

    // Click password
    const $password = '#nextgen-authenticate\\.all\\.log_in_password';
    await page.waitForSelector($password);
    await page.click($password);
    await page.type($password, password);

    // Click submit on the login form
    const $button = '#main-content div > button[type="submit"]';
    await page.waitForSelector($button)
    await page.click($button)

    // Wait for the loading to be finished for sure
    await navigationPromise
    await navigationPromise

    console.log('Logged in OK!');

    // Click "See Delivery Times" and then scrape the value from it
    await page.waitForSelector('.rmq-e181a8bb > div > span > a > span')
    await page.click('.rmq-e181a8bb > div > span > a > span')

    console.log('Getting page content...');

    // Wait for the tabs to show up here if they can 
    await page.waitForSelector('#react-tabs-1 > div > div > div > div > div > div > h1')
    const element = await page.$('#react-tabs-1 > div > div > div > div > div > div > h1');
    const text = await page.evaluate(element => element.textContent, element);

    console.log('Page content gotten!');

    await browser.close()
    return text;
};

if (!username || !password) {
    console.error('You need to provide a username and password to run the scraper.');
    return; // exit
}

const textPromise = getStatus();

textPromise.then((text) => {
    console.log(`Status reported as: "${text}"`);
    if (text !== 'No delivery times available') {
        process.exit(0); // found something aside from "delivery not found"
    }
    process.exit(1); // failed to find something, so we're failing w/ some code so you can figure that much out    
}).catch((e) => {
    console.error(e);
    // process.exit(2); // exited, though with an error code; this would be a problem
});
