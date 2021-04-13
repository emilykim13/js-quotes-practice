const quoteList = document.querySelector('#quote-list')
const quoteBox = document.querySelector('#quote-list').parentElement
const form = document.querySelector('#new-quote-form')

document.addEventListener('DOMContentLoaded', (e)=>{

const setFormListener = () => {
   const quoteContent = document.querySelector('input#new-quote')
   const quoteAuthor = document.querySelector('input#author')
   form.addEventListener('submit', (event) => {
      event.preventDefault()
      newQuote(quoteContent.value, quoteAuthor.value)
   })
}

setFormListener()

const getData = (id) => {
   return fetch(`${"http://localhost:3000/quotes"}/${id}?_embed=likes`)
   .then(data => data.json())
}

fetch(`${"http://localhost:3000/quotes"}?_embed=likes`)
.then(data => data.json())
.then(results => renderAllQuotes(results))

const renderAllQuotes = (quotesData) => {
   for(const quote of quotesData){
      renderQuote(quote)
   }
}

const renderQuote = (quote) => {
    const li = document.createElement('li')
    li.className = 'quote-card'
    li.id = `list_item_${quote.id}`

    const blockQuote = document.createElement('blockquote')
    blockQuote.className = "blockquote"

    const pTag = document.createElement('p')
    pTag.className = "mb-0"
    pTag.innerText = quote.quote

    const footerTag = document.createElement('footer')
    footerTag.className = "blockquote-footer"
    footerTag.innerText = quote.author

    const brTag = document.createElement("br")

    const span = document.createElement('span')
    span.id = `likeFoot_${quote.id}`
    span.innerText =`${(quote.likes === undefined) ? 0 : quote.likes.length}`

    const likeBtn = document.createElement('button')
    likeBtn.id = `like_${quote.id}`
    likeBtn.className = 'btn-success'
    likeBtn.innerText = "Likes: "
    likeBtn.addEventListener('click', (e) => {likeQuote(quote, likeBtn, span)})

    const deleteBtn = document.createElement('button')
    deleteBtn.id = `delete_${quote.id}`
    deleteBtn.className = 'btn-danger'
    deleteBtn.innerText = "DELETE"
    deleteBtn.addEventListener('click', (e) => {deleteQuote(quote, deleteBtn)})

    likeBtn.append(span)
    li.append(blockQuote, pTag, footerTag, brTag, likeBtn, deleteBtn)
    quoteList.append(li)
}

const newQuote = (content, author) => {
//    console.log(content)
//    console.log(author)
configPost = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
          quote: content, 
          author: author})
   }
   fetch("http://localhost:3000/quotes", configPost)
   .then(data => data.json())
   .then(results => renderQuote(results))
}

const deleteQuote = (quote, button) => {
   console.log(quote)
   quoteItem = document.querySelector(`#list_item_${quote.id}`)
   quoteItem.remove()

   fetch(`http://localhost:3000/quotes/${quote.id}`, {
       method: 'DELETE'})
   .then(data => data.json())
   .then(console.log('Quote has been successfully deleted.'))
}

const likeQuote = (quote, button, span) => {
   configPost = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify({
          quoteId: quote.id, 
          createdAt: Date.now()})
   }
   fetch("http://localhost:3000/likes", configPost)
   .then(data => data.json())
   .then(likeData => {
      getData(quote.id)
      .then(result => updateDom(result, span))
   })
}

const updateDom = (newQ, span) => {
   let likes = newQ.likes.length
   span.innerText = `${likes}`
}

}) 