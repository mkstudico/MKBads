(function() {
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBsm5CsGdw0Ntip27pTjBUhP9XlU2rViEQ",
        authDomain: "mkbads.firebaseapp.com",
        projectId: "mkbads",
        storageBucket: "mkbads.firebasestorage.app",
        messagingSenderId: "272037707489",
        appId: "1:272037707489:web:7d2aaf082a3a28b17601a0",
        measurementId: "G-H6P7JNTMV5"
    };

    // Load Firebase scripts dynamically
    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    Promise.all([
        loadScript('https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js'),
        loadScript('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js'),
        loadScript('https://www.gstatic.com/firebasejs/11.9.1/firebase-functions.js')
    ]).then(() => {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Fetch active ads
        async function fetchAds() {
            const now = new Date();
            const snapshot = await db.collection('ads').where('active', '==', true).get();
            const ads = [];
            snapshot.forEach(doc => {
                const ad = doc.data();
                const start = ad.startDate ? ad.startDate.toDate() : null;
                const end = ad.endDate ? ad.endDate.toDate() : null;
                if ((!start || start <= now) && (!end || end >= now)) {
                    ads.push({ id: doc.id, ...ad });
                }
            });
            return ads;
        }

        // Log impression
        async function logImpression(adId) {
            await db.collection('ads').doc(adId).update({
                impressions: firebase.firestore.FieldValue.increment(1)
            });
        }

        // Display ad
        async function displayAd() {
            const ads = await fetchAds();
            if (ads.length === 0) return;

            const ad = ads[Math.floor(Math.random() * ads.length)];
            const adContainer = document.createElement('div');
            adContainer.style.textAlign = 'center';
            const adImage = document.createElement('img');
            adImage.src = ad.imageUrl;
            adImage.style.maxWidth = '100%';
            adImage.style.cursor = 'pointer';
            adImage.alt = 'Advertisement';
            adContainer.appendChild(adImage);
            document.currentScript.parentElement.appendChild(adContainer);

            // Log impression
            logImpression(ad.id);

            // Handle click
            adImage.addEventListener('click', async () => {
                try {
                    const response = await fetch(`https://us-central1-mkbads.cloudfunctions.net/trackClick?adId=${ad.id}`);
                    if (response.ok) {
                        window.location.href = ad.targetUrl;
                    }
                } catch (error) {
                    console.error('Error tracking click:', error);
                    window.location.href = ad.targetUrl;
                }
            });
        }

        displayAd();
    }).catch(error => {
        console.error('Error loading Firebase:', error);
    });
})();
