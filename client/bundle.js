(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { handleJournalSubmit, requestEntries, addGiphy } = require('./journal');

// Setup querySelectors
const formJournal = document.querySelector('#journal');
const giphyButton = document.querySelector('button');
const giphyForm = document.querySelector('#giphy-form');
console.log(giphyButton)

// Setup event listeners
formJournal.addEventListener('submit', handleJournalSubmit);
giphyForm.addEventListener('submit', handleJournalSubmit);

document.onload = requestEntries();

// GIPHY event listeners 

let APIkey = "";
giphyButton.addEventListener('click', addGiphy);



},{"./journal":2}],2:[function(require,module,exports){
// variables for testing
const herokuURL = "https://chirper-uk.herokuapp.com"
const testingURL = "http://localhost:3000"

function handleJournalSubmit(e) {
  console.log(e);
  const button = e.submitter.name;
  if (button === 'entry') {
    submitJournal(e);
  } else if (button === 'giphy') {
    handleGifs(e);
  } else {
    // do nothing
  }
}

function submitJournal(e) {
  e.preventDefault();
  const currentDate = new Date();
  const dateTime = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const journalData = {
    entry: e.target.message.value,
    date: dateTime,
  };

  console.log(journalData);

  const options = {
    method: 'POST',
    body: JSON.stringify(journalData),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(`${herokuURL}/entry`, options)
    .then((r) => r.json())
    .then(appendEntry)
    .catch(console.warn);
}

function appendEntries(entries) {
  entries.forEach((entry) => appendEntry(entry));
}

function findReactions() {
  const getReactions = document.querySelector('body');
  getReactions.addEventListener('click', registerReactions)
}

function registerReactions(e) {
  let anchor = e.target.closest('a');
  if(anchor !== null) {
    if (anchor.id !== "comment") {
      submitReaction(anchor.name, anchor.id);
    } else {
      console.log('Else')
      handleComment(anchor.name, anchor.id);
    }
  } else {
    // do nothing
  }
}

function submitReaction(id, reaction) {
  console.log(id);
  console.log(reaction);
  const reactionData = {
    id: id,
    reaction: reaction,
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(reactionData),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(`${herokuURL}/entry/reaction`, options)
    .then((r) => r.json())
    .then(updateReaction)
    .catch(console.warn);
}

function updateReaction(data) {
  let parent = document.getElementById(data.id);
  let like = parent.querySelector('#like p')
  let dislike = parent.querySelector('#dislike p')
  let tree = parent.querySelector('#tree p')

  like.textContent = data.reaction[0].like
  dislike.textContent = data.reaction[1].dislike
  tree.textContent = data.reaction[2].tree
  
}

function appendEntry(data) {


  const allEntries = document.getElementById('entries');

  const entryDiv = document.createElement('div');
  const date = document.createElement('p');
  const name = document.createElement('h5');

  const reactionDiv = document.createElement('div');
  const like = document.createElement('a');
  const dislike = document.createElement('a');
  const tree = document.createElement('a');
  const comment = document.createElement('a');

  like.id = `like`
  dislike.id = `dislike`
  tree.id = `tree`
  comment.id = `comment`

  like.name = `${data.id}`
  dislike.name = `${data.id}`
  tree.name = `${data.id}`
  comment.name = `${data.id}`

  reactionDiv.className += 'd-flex justify-content-end text-center';

  entryDiv.className += 'entry-box';

  like.className += 'px-3 reaction';
  dislike.className += 'px-3 reaction';
  tree.className += 'px-3 reaction';
  comment.className += 'px-3 reaction';

  like.innerHTML = `<i class="fas fa-thumbs-up fa-2x"></i><p>${data.reaction[0].like}</p>`;
  dislike.innerHTML = `<i class="fas fa-thumbs-down fa-2x"></i><p>${data.reaction[1].dislike}</p>`;
  tree.innerHTML = `<i class="fab fa-pagelines fa-2x"></i><p>${data.reaction[2].tree}</p>`;
  comment.innerHTML = `<i class="fas fa-comment fa-2x"></i>`

  reactionDiv.appendChild(like);
  reactionDiv.appendChild(dislike);
  reactionDiv.appendChild(tree);
  reactionDiv.appendChild(comment);

  entryDiv.id = data.id;
  date.textContent = data.date;
  date.className += 'entry-date';
  name.textContent = 'Anonymous';


  const commentHolder = document.createElement('div');
  commentHolder.id = `comments-${data.id}`
  commentHolder.className = "comments";
  if (data.comments !== null) {
    const comments = data.comments;
    comments.forEach((comment) => {
      const commentBox = document.createElement('div');
      commentBox.className = 'comment';
      const commentUser = document.createElement('h5');
      const aComment = document.createElement('p');

      commentUser.textContent = 'Anonymous';
      aComment.textContent = `"${comment}"`;
      commentBox.appendChild(commentUser);
      commentBox.appendChild(aComment);
      commentHolder.appendChild(commentBox);
    })
  } else {
    // do nothing
  }

  entryDiv.appendChild(date);
  entryDiv.appendChild(name);
  const urlCheck = data.entry;
  if (urlCheck.startsWith('https://')) {
    const image = document.createElement('img');
    image.src = data.entry;
    entryDiv.appendChild(image);
  } else {
    const entry = document.createElement('p');
    entry.textContent = `"${data.entry}"`;
    entry.className += 'entry-message';
    entryDiv.appendChild(entry);
  }
  entryDiv.appendChild(reactionDiv);
  entryDiv.appendChild(commentHolder)
  allEntries.appendChild(entryDiv);
  findReactions();
}

function requestEntries() {
  fetch(`${herokuURL}/entry`)
    .then((r) => r.json())
    .then(appendEntries)
    .catch(console.warn);
}

let messageBox = document.getElementById("messageBox");
let wordCount = document.getElementById("wordCount");
messageBox.addEventListener("keyup",function(){
  console.log('key pressed')
  let characters = messageBox.value.split('');
  wordCount.innerText = characters.length;
  if(characters.length > 150){
    messageBox.value = messageBox.value.substring(0,150);
    alert('You have gone over the character limit of 150 characters.');
    wordCount.innerText = 150; 
  }
})

function addGiphy() {
  console.log('test')
  // get search term //
  let userInput = document.getElementById("giphytwo").value

  // our api key //
  let giphyAPIkey = "9Cizm4XVM8GvD62i82DS39y9oGEE9ERK"

  // overall giphy url using apikey and search term//
  let giphyAPIurl = `https://api.giphy.com/v1/gifs/search?q=${userInput}&rating=g&api_key=${giphyAPIkey}&limit=3`

  // fetch data from api and work with json // 
  fetch(giphyAPIurl)
  .then((r) => r.json())
  .then(displayGifs)
}

function displayGifs(gifs) {
    const giphyArea = document.getElementById('giphy-form');
    giphyArea.className = '';
    console.log(gifs)
    // receives the first img path with fixed height //
    let imageData = gifs.data;
    for (let i = 0; i < imageData.length; i++) {
      let selectImage = imageData[i];
      let imgURL = selectImage.images.fixed_height.url;

      let button = document.getElementById(`giphy-${i + 1}`);
      let radio = document.getElementById(`${i + 1}-gif`);
      radio.value = imgURL;

      button.innerHTML = `<img src="${imgURL}">`;
    }


    // let selectImage = imageData[0]
    // let imgURL = selectImage.images.fixed_height.url
    // // create //
    // let image = document.createElement("img")
    // image.setAttribute("src", imgURL)
    // document.body.appendChild(image)
}

function handleGifs(e) {
  e.preventDefault();
  let radio;
  let url;
  const firstRadio = e.target[0].checked;
  const secondRadio = e.target[1].checked;
  const thirdRadio = e.target[2].checked;
  if (firstRadio) {
    radio = document.getElementById('1-gif');
    url = radio.value;
  } else if (secondRadio) {
    radio = document.getElementById('2-gif');
    url = radio.value;
  } else if (thirdRadio) {
    radio = document.getElementById('3-gif');
    url = radio.value;
  } else {
    alert('oi');
    return
  }

  submitGif(url);
}

function submitGif(url) {
  const currentDate = new Date();
  const dateTime = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const journalData = {
    entry: url,
    date: dateTime,
  };

  console.log(journalData);

  const options = {
    method: 'POST',
    body: JSON.stringify(journalData),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(`${herokuURL}/entry`, options)
    .then((r) => r.json())
    .then(appendEntry)
    .catch(console.warn);

  
  const giphyArea = document.getElementById('giphy-form');
  giphyArea.className = 'd-none';
}

function handleComment(id, reaction) {
  const checkComment = document.getElementById('commentForm')
  if (checkComment) {
    checkComment.innerHTML = '';
    checkComment.remove();
  }
  const entry =  document.getElementById(id);
  const commentForm = document.createElement('form');
  const commentArea = document.createElement('TEXTAREA');
  const submitButton = document.createElement('input')

  commentForm.id = 'commentForm'
  commentArea.id = 'commentBox'
  commentArea.name = 'commentBox'
  commentArea.className += 'form-control mb-2'
  commentArea.placeholder = 'Write comment here...'

  submitButton.type = 'submit';
  submitButton.id = 'commentSubmit';
  submitButton.name = id;

  commentForm.appendChild(commentArea);
  commentForm.appendChild(submitButton);
  entry.appendChild(commentForm);

  commentForm.addEventListener('submit', submitComment)

}

function submitComment(e) {
  console.log(e);
  e.preventDefault();

  const commentData = {
    id: e.submitter.name,
    comment: e.target.commentBox.value,
  };

  console.log(commentData);

  const options = {
    method: 'POST',
    body: JSON.stringify(commentData),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(`${herokuURL}/entry/comment`, options)
    .then((r) => r.json())
    .then(updateComment)
    .catch(console.warn);
}

function updateComment(data) {
  const commentHolder = document.getElementById(`comments-${data.id}`);
  commentHolder.innerHTML = '';
  if (data.comments !== null) {
    const comments = data.comments;
    comments.forEach((comment) => {
      const commentBox = document.createElement('div');
      commentBox.className = 'comment';
      const commentUser = document.createElement('h5');
      const aComment = document.createElement('p');

      commentUser.textContent = 'Anonymous';
      aComment.textContent = `"${comment}"`;
      commentBox.appendChild(commentUser);
      commentBox.appendChild(aComment);
      commentHolder.appendChild(commentBox);
    })
  } else {
    // do nothing
  }
}

module.exports = {
  handleJournalSubmit,
  submitJournal,
  appendEntry,
  appendEntries,
  requestEntries,
  addGiphy
};

},{}]},{},[1]);
