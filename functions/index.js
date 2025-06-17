const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.trackClick = functions.https.onRequest(async (req, res) => {
    const adId = req.query.adId;
    if (!adId) {
        return res.status(400).send('Missing adId');
    }

    try {
        await admin.firestore().collection('ads').doc(adId).update({
            clicks: admin.firestore.FieldValue.increment(1)
        });
        res.status(200).send('Click tracked');
    } catch (error) {
        console.error('Error tracking click:', error);
        res.status(500).send('Error tracking click');
    }
});
