const fetchData  = require('./scrapeAPI.js');
const fetch = require('node-fetch');
require('dotenv').config();

fetchData().then(classInfo => {
  // extract course topics and remove duplicates
  let topics = [...new Set(classInfo.map(info => info['Course Topic']))];
  // format topics for discord message
  let formattedTopics = topics.map(topic => '• ' + topic + ' ✅').join('\n');

  // discord webhook url
  let webhook = process.env.WEBHOOK;

  let discordMessage = {
    content: formattedTopics,  
    username: 'CS Class Finder🤓',  
  };

  // send the message to discord
  fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(discordMessage)
  })
  .then(response => console.log(`Message sent to Discord`))
  .catch(error => console.log('Error sending message to Discord:', error));
});
