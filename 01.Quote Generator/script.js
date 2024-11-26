const quote = document.getElementById('quote');
const author = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const quoteContainer = document.getElementById('quote-container');
const loader = document.getElementById('loader');
const quoteText = document.getElementById('quote-text');

//Array of Objects for Text and Author
let apiQuotes=[];

// Generate Quote
function newQuote() {
    loading();
    const randomQuote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    quote.innerText= randomQuote.text;
    // Check for Quote's size
    if(randomQuote.text.length>120){
        quoteText.classList.add('long-quote');
    }else{
        quoteText.classList.remove('long-quote');
    }
    // Check for Author name
    if(randomQuote.author==='type.fit'||!randomQuote.author){
        author.innerText='Unknown';
    }else if (randomQuote.author.includes("type.fit")){
        //Cutting the Watermark of the Quotes Website
        console.log(randomQuote.author);
        author.innerText= randomQuote.author.slice(0, randomQuote.author.indexOf(','));
    }
    else {
        author.innerText= randomQuote.author;
    }
    complete();
}
//Get Quotes from API
async function getQuotes(){
    loading();
    const apiUrl='https://type.fit/api/quotes';
    try {
        const response = await fetch(apiUrl);
        apiQuotes = await response.json();
        newQuote();
    } catch(error) {
        apiQuotes=localQuotes;
        newQuote();
        //getQuotes();
        console.log(error);
    }
}

// Loading Spining Function (Loader)
function loading(){
    quoteContainer.hidden=true;
    loader.hidden=false;
    
}

//Remove the Loading Function (Remove Loader)
function complete(){
    quoteContainer.hidden=false;
    loader.hidden=true;
}

// Tweet Function
function tweet () {
    const twitterURL=`https://twitter.com/intent/tweet?text=${quote.innerText} - ${author.innerText}`;
    window.open(twitterURL, '_blank');
}

//Event Listeners
twitterBtn.addEventListener('click', tweet);
newQuoteBtn.addEventListener('click',newQuote);

//On Load
getQuotes();