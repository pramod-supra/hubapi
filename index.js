const express = require('express')
const app = express();
const mysql = require('mysql');
var waterfall = require('async-waterfall');
var https = require("https");
var request = require("request")
const returnedContacts = [];
const API_KEY = '2bdc26d3-88f2-4fbd-972f-4790cecbfc6c'
const count = 5;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_mysql'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

waterfall([
  function(callback){
    console.log("1")
     callback(null, 'one', 'two');
  },
  function(arg1, arg2, callback){
    console.log("2")
    callback(null, 'three');
  },
  function(arg1, callback){
    console.log("3")
    // arg1 now equals 'three'
    callback(null, 'done');
  }
], function (err, result) {
  console.log("4")
  // result now equals 'done'
});




function tap(tcontacts)
{
  
  let dd=connection.query('INSERT INTO hubspotcontact (id,Email,IsContanct,ProfileToken, ProfileUrl,CreateDate,State,Zip) VALUES ('+tcontacts.vid+',"'+tcontacts['identity-profiles'][0]['identities'][0]['value']+'","'+tcontacts['is-contact']+'","'+tcontacts['profile-token']+'","'+tcontacts['profile-url']+'","'+tcontacts.addedAt+'",""," ");')
  console.log(dd)
}


app.get('/api/hubspot/contact/all', (req, res) => {
  connection.query('SELECT * FROM hubspotcontact', (err,rows) => {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      res.send(rows)
      var request = require("request");

      var options = { method: 'GET',
        url: 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all',
        qs: { hapikey: '2bdc26d3-88f2-4fbd-972f-4790cecbfc6c' },
        headers: 
         { 'postman-token': 'dd165292-98e0-16ad-395d-47e70c164458',
           'cache-control': 'no-cache' } };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let test=JSON.parse(body)
      console.log(test)
      console.log(test.contacts)
      console.log(test.contacts.length)
 for(let i=0;i<test.contacts.length;i++)
 {
  tap(test.contacts[i])
 }
     //  console.log(response['contacts'].length)
       //  console.log(body);
      });
      });
});
app.post('/api/hubspot/contact/:vid', (req, res) => {
console.log(req.params.vid)
  connection.query('SELECT * FROM hubspotcontact where id="'+req.params.vid+'"', (err,rows) => {
      if(err) throw err;
      console.log('Data received from Db:\n');
      console.log(rows);
      res.send(rows)
      });
});

app.post('/api/hubspot/contact/delete/:vid', (req, res) => {
  console.log(req.params.vid)
    connection.query('DELETE FROM hubspotcontact WHERE id="'+req.params.vid+'"', (err,rows) => {
        if(err) throw err;
        console.log('Data received from Db:\n');
        console.log(rows);
        res.send(rows)
        });
  });


 

// {baseurl} - Method: GET
app.listen(8000, () => {
 console.log('Example app listening on port 8000!')
});