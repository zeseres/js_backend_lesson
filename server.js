const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());

async function getDbCollection(dbAdress, dbName, dbCollectionName){
	const client = new MongoClient(dbAdress);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollectionName);
}

app.get('/tasks', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1','todoapp','task');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/tasks/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1','todoapp','task');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/tasks', async function(req, res){
	const task = {...req.body, done: false};
	const collection = await getDbCollection('mongodb://127.0.0.1','todoapp','task');
	await collection.insertOne(task);
	res.send(task);
}); 

app.patch('/tasks/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1','todoapp','task');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)},{'$set': req.body});
	res.send({});
});

app.delete('/tasks/:id', async function(req, res){
	const collection = await getDbCollection('mongodb://127.0.0.1','todoapp','task');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
});


app.listen(port,function() {
	console.log('Server is started');
	});