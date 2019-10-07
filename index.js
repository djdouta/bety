const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const path = require("path");
const ip = require("ip");
const assert = require("assert");
const ipLocal = ip.address();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const build = path.resolve(__dirname, "./build");

const app = express();
const normalizePort = port => parseInt(port, 10);

// const PUERTO = 3002;
const PUERTO = normalizePort(process.env.PORT || 3002);
app.set("port", PUERTO);
const dev = app.get(`env`) !== "production";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// if (!dev) {
// if (dev) {
app.disable("x-powered-by");
app.use(compression());
// app.use(morgan("common"));
app.use(express.static(build));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});
// }

const server = createServer(app);
server.listen(PUERTO, error => {
  if (error) throw error;
  console.log(`Aplicacion corriendo en ip: ${ipLocal}:${PUERTO}`);
});

// Database Name
const dbName = "myproject";
const uri =
  "mongodb+srv://djdouta:20761019@betty-hyw9k.azure.mongodb.net/test?retryWrites=true&w=majority";

const findDocuments = function(db, valor, collection_name, res, callback) {
  const collection = db.collection(collection_name);

  if (valor === "") {
    collection.find().toArray(function(err, docs) {
      assert.equal(err, null);
      res.send(docs);
      callback(docs);
    });
  } else {
    collection.find({ pagina: parseInt(valor) }).toArray(function(err, docs) {
      assert.equal(err, null);
      res.send(docs);
      callback(docs);
    });
  }
};
const updateDocument = function(db, collection_name, data, res, callback) {
  let objectId = new ObjectID(data._id);
  delete data._id;
  delete data.tableData;
  // Get the documents collection
  const collection = db.collection(collection_name);
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ _id: objectId }, { $set: data }, function(
    err,
    result
  ) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    res.send("Cambiado");
    callback(result);
  });
};

const insertDocuments = function(db, collection_name, data, res, callback) {
  // Get the documents collection
  const collection = db.collection(collection_name);
  // Insert some documents
  collection.insertOne(data, function(err, result) {
    assert.equal(err, null);
    assert.equal("1", result.result.n);
    res.send("insertado");
    callback(result);
  });
};

const removeDocument = function(db, collection_name, id, res, callback) {
  var objectId = new ObjectID(id);
  // Get the documents collection
  const collection = db.collection(collection_name);
  // Delete document where a is 3
  collection.deleteOne({ _id: objectId }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    res.send("Eliminado");
    callback(result);
  });
};

app.post("/row", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db(dbName);
      insertDocuments(db, "row", req.body, res, function() {
        client.close();
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/getRow", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db(dbName);
      findDocuments(db, req.body.pagina, "row", res, function() {
        client.close();
      });
    })
    .catch(err => {
      console.log(err);
    });
});
app.put("/row", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db(dbName);
      updateDocument(db, "row", req.body, res, function() {
        client.close();
      });
    })
    .catch(err => {
      console.log(err);
    });
});
app.delete("/row/*", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db(dbName);
      removeDocument(db, "row", req.params["0"], res, function() {
        client.close();
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/getPagina", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db(dbName);
      findDocuments(db, "", "pagina", res, function() {
        client.close();
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/pagina", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db(dbName);
      updateDocument(db, "pagina", req.body, res, function() {
        client.close();
      });
    })
    .catch(err => {
      console.log(err);
    });
});
