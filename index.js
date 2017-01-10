const express = require('express');
const app = express();

const mongojs = require('mongojs');
const { ObjectId } = mongojs;
const db = mongojs(process.env.MONGODB_URI, ['demo_collection']).demo_collection;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(req, resp) {
  resp.render('pages/index');
});


app.get('/api', function({ query }, resp) {
  if (!query) return console.error('Error: No query parameters');

  function findAll(err) {
    if (err) return console.error('There was an error executing the database query.');
    db.find(function (err, data) {
      if (err) return console.error('There was an error executing the database query.');
      resp.send({
        message: 'Success',
        data: data
      });
    });
  }

  switch (query.type) {
    case 'get':
      findAll();
      break;
    case 'add':
      db.insert({ name: query.name, value: query.value }, findAll);
      break;
    case 'update':
      db.update({ name: query.name }, {$set: {value: query.value}}, findAll);
      break;
    case 'delete-one':
      db.remove({ _id: ObjectId(query.id) }, function (err) {
        findAll();
      });
      break;
    case 'delete-all':
      db.drop(findAll);
      break;
  }
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


