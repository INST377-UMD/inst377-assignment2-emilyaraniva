let quoteCache = [];

async function loadQuotes() {
  const api_url = "https://zenquotes.io/api/random"; 
  try {
    const response = await fetch(api_url);
    const data = await response.json();
    quoteCache = data;  
    console.log("Quote loaded successfully");
    displayRandomQuote(); 
  } catch (error) {
    console.error("Failed to load quote:", error);
  }
}

function displayRandomQuote() {
  const quoteEl = document.getElementById('quote');
  if (quoteCache && quoteCache.length > 0) {
    const quote = quoteCache[0]; 
    quoteEl.innerText = `"${quote.q}" — ${quote.a}`; 
  } else {
    quoteEl.innerText = "Failed to load a quote."; 
  }
}

function turnOnAudio() {
  if (annyang) annyang.start();
}

function turnOffAudio() {
  if (annyang) annyang.abort();
}

if (annyang) {
  const commands = {
    hello: () => alert('Hello World'),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      const dest = page.toLowerCase();
      if (dest.includes('home')) window.location.href = 'index.html';
      else if (dest.includes('stocks')) window.location.href = 'stocks.html';
      else if (dest.includes('dogs')) window.location.href = 'dogs.html';
    }
  };
  annyang.addCommands(commands);
}

window.onload = async function () {
  await loadQuotes(); 
};
