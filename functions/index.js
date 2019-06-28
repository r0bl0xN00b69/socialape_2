const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projectape-bfd4b.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World you Ape!");
});

exports.getScreams = functions.https.onRequest((request, response) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then(data => {
      let scream = [];
      data.forEach(doc => {
        scream.push(doc.data());
      });
      return response.json(scream);
    })
    .catch(err => console.error(err));
});

exports.createScream = functions.https.onRequest((request, response) => {
  if (request.method !== "POST") {
    return response.status(400).json({ error: "Method Not Allowed" });
  }
  const newScream = {
    body: request.body.body,
    user: request.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      response.json({ message: `document ${doc.id} created succesfully` });
    })
    .catch(err => {
      response.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});
