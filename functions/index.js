const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("hi world!");
});

exports.getAnimalEntry = functions.https.onRequest((req, res) => {
    admin.firestore().collection('animalEntries').get()
        .then(data => {
            let animalEntry = [];
            data.forEach(doc => {
                animalEntry.push(doc.data());
            });
            return res.json(animalEntry);
        })
        .catch(err => console.error(err));
});

exports.createAnimalEntry = functions.https.onRequest((req, res) => {

    if(req.method !== 'POST'){
        return res.status(400).json({ error: 'Method not allowed' });
    }

    const newAnimalEntry = {
        body: req.body.body,
        admitDate: req.body.admitDate,
        medicineDetails: req.body.medicineDetails,
        name: req.body.name,
        neuterDate: req.body.neuterDate,
        outDate: req.body.outDate,
        remark: req.body.remark,
        type: req.body.type,
        vaccineDetails: req.body.vaccineDetails
    };

    admin.firestore()
        .collection('animalEntries')
        .add(newAnimalEntry)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`});
        })
        .catch(err =>{
            res.status(500).json({ error: `something went wrong`});
            console.error(err);
        });
});