//testing to see anime works
//npm install prompt-sync
//npm install puppeteer
//npm install puppeteer-extra
//npm install puppeteer-extra-plugin-stealth
//npm install sentiment
//extra stealth is needed since website might detect bot lol

const prompt = require("prompt-sync")({sigint:true})
const puppeteer = require('puppeteer-extra');  
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());
const Sentiment = require('sentiment')
const sentiment = new Sentiment()

let verySimilar = []
let verySimilarName = []
let verySimilarScores = []

let similar = []
let similarName = []
let similarScores = []

async function scraper(url, url2, input){
    //----------------------
    // let input = prompt("enter your mood")
    const inputAnalysis = await sentiment.analyze(input)
    console.log(inputAnalysis.score + "lol1")
    //----------------------

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    for(let i = 1; i < 50; i+= 1){ 
        const [el] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[2]/tbody/tr[' + i + ']/td[2]');
        const txt = await el.getProperty('textContent'); 
        const rawTxt = await txt.jsonValue();
        //console.log(typeof(rawTxt))
        sanitizedStr = rawTxt.substring(rawTxt.indexOf('"') + 1); //remove all characters before "
        sanitizedStr = sanitizedStr.slice(0, sanitizedStr.indexOf("[")-1); //remove quotations
        //console.log(sanitizedStr);
        //console.log(rawTxt);
        
        const result = await sentiment.analyze(sanitizedStr) //creates object
        //console.log(result)

        //person quoted from:
        const [el2] = await page.$x('//*[@id="mw-content-text"]/div[1]/table[2]/tbody/tr[' + i + ']/td[3]');
        const name = await el2.getProperty('textContent'); 
        const rawName = await name.jsonValue();

        if(result.score == inputAnalysis.score){ //accessing score from both objects
            verySimilar.push(sanitizedStr)
            verySimilarName.push(rawName)
            verySimilarScores.push(result.score)

        }else if(Math.abs(result.score - inputAnalysis.score) == 1 || Math.abs(result.score - inputAnalysis.score) == 2){
            similar.push(sanitizedStr)
            similarName.push(rawName)
            similarScores.push(result.score)
            //console.log(result.score)
        }

    }

    // //----------------------------url 1 ends, url 2 begins
    // const browser2 = await puppeteer.launch();
    // const page2 = await browser2.newPage();
    // await page2.goto(url2);

    // console.log("similar results: " + similar)
    // console.log("very similar results: " + verySimilar) //*[@id="post-53159"]/div[3]/blockquote[1]/p/text()
    // for(let i = 1; i < 10; i+= 1){                     //*[@id="post-53159"]/div[3]/blockquote[2]/p/text()
    //     const [el] = await page2.$x('//*[@id="post-53159"]/div[3]/blockquote[' + i + ']/p/text()');
    //     const txt = await el.getProperty('textContent'); 
    //     const rawTxt = await txt.jsonValue();
    //     //console.log(typeof(rawTxt))
    //     sanitizedStr = rawTxt.substring(rawTxt.indexOf('"') + 1); //remove all characters before "
    //     sanitizedStr = sanitizedStr.slice(0, -1); //remove quotations
    //     //console.log(sanitizedStr);
    //     //console.log(rawTxt);
        
    //     const result = await sentiment.analyze(sanitizedStr) //creates object
    //     //console.log(result)

    //     //person quoted from:
    //     //*[@id="post-53159"]/div[3]/blockquote[1]/cite/text()
    //     //*[@id="post-53159"]/div[3]/blockquote[2]/cite/text()
    //     const [el2] = await page2.$x('//*[@id="post-53159"]/div[3]/blockquote[' + i + ']/cite/text()');
    //     const name = await el2.getProperty('textContent'); 
    //     const rawName = await name.jsonValue();

    //     if(result.score == inputAnalysis.score){ //accessing score from both objects
    //         verySimilar.push(sanitizedStr)
    //         verySimilarName.push(rawName)
    //         verySimilarScores.push(result.score)
    //         console.log("good!")

    //     }else if(Math.abs(result.score - inputAnalysis.score) == 1 || Math.abs(result.score - inputAnalysis.score) == 2){
    //         similar.push(sanitizedStr)
    //         similarName.push(rawName)
    //         similarScores.push(result.score)
    //         console.log("nice!")
    //         //console.log(result.score)
    //     }

    // }

    dictData = {similarList: similar, similarNameList: similarName, similarScoresList: similarScores, verySimilarList : verySimilar, verySimilarNamesList : verySimilarName, verySimilarNamesScoresList : verySimilarScores, inputAnalysisScore : inputAnalysis.score}

    if(verySimilar.length == 0){
        if(similar.length == 0){
            console.log("whoops, theres nothing similar :sweat_smile:")
        }else{ // random genning a quote
            let calculation = Math.floor(Math.random() * (similar.length-1))
            let moodString = similar[calculation]
            let character = similarName[calculation]
            console.log(moodString)
            console.log(character)
            console.log(similarScores[calculation] + "score")

        }
    }else{
        let calculation = Math.floor(Math.random() * (verySimilar.length-1))
        let moodString = verySimilar[calculation]
        let character = verySimilarName[calculation]
        console.log(moodString)
        console.log(character)
        console.log(verySimilarScores[calculation] + "score")
    }

    //DEBUG
    //let teststr = ""
    //console.log(teststr)
    //const result = await sentiment.analyze(teststr)
    //console.log(result)
    browser.close();
    //browser2.close();

    // return JSON  
}

// scraper('https://en.wikipedia.org/wiki/AFI%27s_100_Years...100_Movie_Quotes', 'https://www.goalcast.com/anime-quotes/')
//OTHER SITE:
//https://www.afi.com/afis-100-years-100-movie-quotes/

module.exports = {scraper}