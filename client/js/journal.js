function handleJournalSubmit(e) {
  console.log(e);
  const button = e.submitter.name;
  if (button === 'entry') {
    submitJournal(e);
  } else if (button === 'giphy') {
    // run giphy request
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

  fetch('https://chirper-uk.herokuapp.com/entry', options)
    .then((r) => r.json())
    .then(appendEntry)
    .catch(console.warn);
}

function appendEntries(entries) {
  entries.forEach((entry) => appendEntry(entry));
}

function appendEntry(data) {
  const allEntries = document.getElementById('entries');

  const entryDiv = document.createElement('div');
  const date = document.createElement('p');
  const name = document.createElement('h5');
  const entry = document.createElement('p');

  const reactionDiv = document.createElement('div');
  const like = document.createElement('a');
  const dislike = document.createElement('a');
  const tree = document.createElement('a');
  const comment = document.createElement('a');

  reactionDiv.className += 'd-flex justify-content-end';

  like.className += 'px-3 reaction';
  dislike.className += 'px-3 reaction';
  tree.className += 'px-3 reaction';
  comment.className += 'px-3 reaction';

  like.innerHTML = `<i class="fas fa-thumbs-up fa-2x"></i>`;
  dislike.innerHTML = `<i class="fas fa-thumbs-down fa-2x"></i>`;
  tree.innerHTML = `<i class="fab fa-pagelines fa-2x"></i>`;
  comment.innerHTML = `<i class="fas fa-comment fa-2x"></i>`

  reactionDiv.appendChild(like);
  reactionDiv.appendChild(dislike);
  reactionDiv.appendChild(tree);
  reactionDiv.appendChild(comment);

  entryDiv.id = data.id;
  date.textContent = data.date;
  name.textContent = 'Anonymous';
  entry.textContent = `"${data.entry}"`;

  entryDiv.appendChild(date);
  entryDiv.appendChild(name);
  entryDiv.appendChild(entry);
  entryDiv.appendChild(reactionDiv);

  allEntries.appendChild(entryDiv);
}

function requestEntries() {
  fetch('https://chirper-uk.herokuapp.com/entry')
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
    wordCount.innerText = 150; 
  }
})

module.exports = {
  handleJournalSubmit,
  submitJournal,
  appendEntry,
  appendEntries,
  requestEntries,
};
