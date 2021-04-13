document.addEventListener("DOMContentLoaded", () => {
    getQuotes()
    setUpForm()
})
function getQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotesData => {
        quotesData.forEach(renderQuote)
    })
}

function renderQuote(quote){
    // console.log(quote)
    const quoteContainer = document.getElementById('quote-list')

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
    // likesButton.innerText = "Likes: "
    likesButton.innerHTML = `Likes: <span> ${(quote.likes === undefined) ? 0 : quote.likes.length} </span>`
    // add event listener for increasing likes
    likesButton.addEventListener("click", () => {  
        createLike(quote)
        likesButton.innerHTML = `Likes: <span>${++quote.likes.length}</span>`
    })
    // const span = document.createElement("span")
    // span.innerText = 0 // `${quote.likes.length}`

    const deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener("click", ()=> {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
    })
    li.remove()
    })

    li.append(blockquote)
    // likesButton.append(span)
    blockquote.append(p, footer, br, likesButton, deleteButton)
    quoteContainer.append(li)
}

// set up form
const setUpForm = () => {
    const quoteForm = document.querySelector("#new-quote-form")
    quoteForm.addEventListener("submit", event => {
        event.preventDefault() //no refreshes
        const newQuote = event.target['new-quote'].value
        const newAuthor = event.target.author.value
        // console.log(newQuote)
        // console.log(newAuthor)
        createNewQuote(newQuote, newAuthor)
    })
}

const createNewQuote = (newQuote, newAuthor) => {
    console.log(newQuote, newAuthor)
    const newQuoteObject = {
        quote: newQuote, 
        author: newAuthor
    }

    const optionsObject = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newQuoteObject)
    }

    fetch("http://localhost:3000/quotes", optionsObject)
    .then(res => res.json())
    .then(postedQuote => renderQuote(postedQuote))
}

const createLike = (quote) => {
    console.log("This quote gets a like", quote)

    const newLike = {
        quoteId: quote.id,
        createdAt: Date.now()
    }
    const optionsObject = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newLike)
    }

    fetch("http://localhost:3000/likes", optionsObject)
    .then(res => res.json())
    .then(data => console.log(data))
}