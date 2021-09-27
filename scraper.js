const puppeteer = require ("puppeteer");
const { compose } = require("redux");

const login = {
    username: "coop.test@condoworks.co",
    password: "MyTesting711"
}
async function getPDF(){
    // Opening puppeteer 
    const browser = await puppeteer.launch({ 
        headless: false,
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 1900,
        height: 1000
    })
    //await page.setDefaultNavigationTimeout(5000); 
    await page.goto("https://app-dev.condoworks.co/")

    // Login 
    const EmailInput = '#Email'
    const PasswordInput = '#Password'
    const submitBtn = '#btnSubmit'

    await page.type(EmailInput, login.username)
    await page.type(PasswordInput, login.password)
    await page.click(submitBtn)

    await page.waitForNavigation().then(console.log('logged in'))

    // Navigate to invoices  
    await page.goto("https://app-dev.condoworks.co/invoices/all",   {waitUntil: 'domcontentloaded'})
    await page.goto("https://app-dev.condoworks.co/invoices/all",   {waitUntil: 'domcontentloaded'})


    const invoiceNumberInput = "#gs_invoices.InvoiceNumber"
    const viewInvoiceBtn = '.btn-outline-secondary'

    // search (bad)
    // page.click('#gs_invoices.InvoiceNumber').then(console.log('aaasasdasdasdas'))
    // await page.click('#gridId').then(console.log('aaasasdasdasdas'))
    //await page.waitForSelector('#gridId', {visible: true}).then(console.log('found1'))
    // await page.waitForSelector(invoiceNumberInput, {visible: true}).then(console.log('found2')).catch(() => console.error('coudlnt find'))

    const ref = await page.$('#gridId').then((res) => console.log(res))

    // setTimeout(async () =>{
    //     await page.waitForSelector(invoiceNumberInput, {visible: true}).then(console.log('found'))
    //     await page.click(invoiceNumberInput).then(console.log('clicked'))
    //     await page.type(invoiceNumberInput, "123").then(console.log('asada'))
    //     await page.waitForResponse(res => res.status() == 200)
    //     await page.click(viewInvoiceBtn)
    // }, 1000)
}

getPDF().catch((er) => {
    console.error(er)
    console.error('couldnt find selector')
})