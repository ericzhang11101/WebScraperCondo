const puppeteer = require ("puppeteer");
const downloadsFolder = require('downloads-folder')

const login = {
    username: "coop.test@condoworks.co",
    password: "MyTesting711"
}
async function getPDF(){
    // Opening puppeteer 
    const browser = await puppeteer.launch({ 
        headless: false,
        userDatadir: '/puppeteer'
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

    await page.waitForNavigation()

    // Navigate to invoices  
    await page.goto("https://app-dev.condoworks.co/invoices/all",   {waitUntil: 'domcontentloaded'})

    // Input into Invoice # 
    // Puppeteer couldn't find the selector for the input so I had to do in vanilla JS
    // Would be much cleaner to type with puppeteer
    await page.$eval("#gridId", async () => {
        // Input 123 
        const inputTarget = document.getElementById('gs_invoices.InvoiceNumber')
        inputTarget.value = '123'

        // Wait a second for DOM to be updated 
        setTimeout(() => { 
            // Gets all invoice number elements 
            const list = document.querySelectorAll('[aria-describedby="grid4d1e941d1c0c1e4ec4887684a2cb0530d_invoices.InvoiceNumber"]')

            // Looks for element matching the target (123444)
            list.forEach(async (td) => {
                if (td.innerHTML === "123444"){
                    // Gets button element from the same row as matching target
                    const targetLink = td.parentElement.firstChild.firstChild
                    console.log(targetLink)
                    targetLink.click()
                }
            })
        }, 1000);
        
    })

    // Code periodically checks if page has changed from the invoice search 
    // Await in previous function does not wait for the callbacks inside to complete, needed to manually check 

    const interval = setInterval(() => {
        if (page.url() === "https://app-dev.condoworks.co/invoices/all"){
        }
        else{
            download()
        }
    }, 1000)

    async function download(){
        // Stops interval 
        clearInterval(interval)

        // Clicks download 
        await page.click("#thumb-InvoiceFile-init-0 > div.file-thumbnail-footer > div.file-actions > div > a")
            .then(async () =>{
                console.log('File downloaded to: ' + downloadsFolder())
            })
    }

}

getPDF().catch((er) => {
    console.error(er)
    console.error('Puppeteer failed task!')
})