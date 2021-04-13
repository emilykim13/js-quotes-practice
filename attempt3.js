// loader 
document.addEventListener("DOMContentLoaded", () => {
    getQuotes()
    setupQuoteForm()
})

// fetch data
const getQuotes = () => {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then((res) => res.json())
    .then((quotes) => quotes.forEach(renderQuote))
}
// renderQuote
const renderQuote = (quote) => {
    const quoteList = document.querySelector("#quote-list")

    const li = document.createElement("li")
    li.className = "quote-card"

    const blockquote = document.createElement("blockquote")
    blockquote.className = "blockquote"

    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    const footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author

    const br = document.createElement("br")

    const likesButton = document.createElement("button")
    likesButton.className = "btn-success"
    likesButton.innerText = "Likes: "
    // add event listener for increasing likes
    likesButton.addEventListener("click", (e) => {likeQuote(quote, likesButton, footer)})

    const span = document.createElement("span")
    span.innerText = 0 // `${quote.likes.length}`

    const deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    // add event listener for deleting quote
    deleteButton.id = quote.id
    deleteButton.addEventListener("click", event => deleteQuote(quote))


    li.append(blockquote)
    likesButton.append(span)
    blockquote.append(p, footer, br, likesButton, deleteButton)
    quoteList.append(li)
}


// setupQuoteForm
const setupQuoteForm = () => {
    const quoteForm = document.querySelector("#new-quote-form")
    quoteForm.addEventListener("submit", event => {
        event.preventDefault()
        createQuote(quoteForm)
    })
}

// createQuote POST
const createQuote = (quoteForm) => {
    // console.log(quoteForm.author.value)
    const newQuote = {
        quote: quoteForm.quote.value,
        author: quoteForm.author.value
        }

    fetch("http://localhost:3000/quotes?_embed=likes", {
        method: "POST",
        headers: {
        "content-type": "application/json",
        "accept": "application/json",
        },
        body: JSON.stringify(newQuote)
    })
    .then(res => res.json())
    .then(newQuote => renderQuote(newQuote))
}

// likeQuote

const getData = (id) => {
    fetch(`http://localhost:3000/quotes/${id}?_embed=likes`)
    .then(data => data.json())
 }

const likeQuote = (quote, likesButton, footer) => {
    configOpt = {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
       },
       body: JSON.stringify({
           quoteId: quote.id, 
           createdAt: Date.now()
        })
    }
    fetch("http://localhost:3000/likes", configOpt)
    .then(data => data.json())
    .then(likeData => {
       getData(quote.id)
       .then(result => updateDom(result, footer))
    })
 };

const updateLikes = (newLikeData, quote, footer) => {
    fetch("http://localhost:3000/likes")
    .then(data => data.json())
    .then(results => updateDom(results, quote, footer))
};
 
const updateDom = (results, quote, footer)  => {
    quoteNumber = (quote.likes !== undefined ? quote.likes.length : 0 )
    footer.innerText = `Likes received: ${quoteNumber + 1}`;
};

// deleteQuote (works but doesn't refresh)
const deleteQuote = (quote) => {
event.preventDefault()
    fetch(`${"http://localhost:3000/quotes"}/${event.target.id}`, {
        method: "DELETE"
        })
    .then(response => response.json())
    .then(console.log('Quote has been successfully deleted.'))
    // .then(res => renderQuote(res))
    // deletes the wquote but doesn't refresh
}


// editQuote PATCH
