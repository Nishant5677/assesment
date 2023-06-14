const { google } = require('googleapis');

const express=require('express')
// Authentiction credentials
const CLIENT_ID = '94710747281-gccdd9vj5frvh9lsmoubues8hq7opa9c.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/callback';
// Scope for accessing Gmail API
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Creating authentiction client
// Create OAuth2 client
const authClient = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
  //Generate authentication URL
  const authUrl = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log('Authorize this app by visiting the following URL:');
  console.log(authUrl);
  
  // start Express server
  const app = express();
  
  //Callback route
  app.get('/callback', (req, res) => {
    const code = req.query.code;
  
    //Exchange authorization code for access token
    authClient.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
  
      //Set access token for the OAuth2 client
      authClient.setCredentials(token);
  
      //Create Gmail API client
      const gmail = google.gmail({ version: 'v1', auth: authClient });
  
      //Retrieve list of messages
      gmail.users.messages.list(
        {
          userId: 'me',
          labelIds: ['INBOX'],
        },
        (err, res) => {
          if (err) {
            console.error('Error retrieving emails', err);
            return;
          }
  
          const messages = res.data.messages;
          if (messages && messages.length) {
            console.log('New emails:');
            messages.forEach((message) => {
              console.log('- ', message.id);
            });
          } else {
            console.log('No new emails.');
          }
        }
      );
      //Close the server
      server.close();
    });
  
    res.send('Authorization successful')
  });
  // Start the server
  const server = app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
  
