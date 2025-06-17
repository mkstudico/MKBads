(function() {
    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBsm5CsGdw0Ntip27pTjBUhP9XlU2rViEQ",
        authDomain: "mkbads.firebaseapp.com",
        projectId: "mkbads",
        storageBucket: "mkbads.appspot.com",
        messagingSenderId: "272037707489",
        appId: "1:272037707489:web:7d2aaf082a3a28b17601a0",
        measurementId: "G-H6P7JNTMV5"
    };

    // Load Firebase scripts synchronously
    document.write('<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>');
    document.write('<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>');
    document.write('<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-functions-compat.js"></script>');

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Apply display style
    function applyDisplayStyle(adContainer, adImage, displayStyle) {
        adContainer.style.textAlign = 'center';
        if (displayStyle === 'small') {
            adImage.style.maxWidth = '300px';
        } else if (displayStyle === 'medium') {
            adImage.style.maxWidth = '600px';
        } else if (displayStyle === 'large') {
            adImage.style.maxWidth = '100%';
        } else if (displayStyle === 'left') {
            adContainer.style.textAlign = 'left';
            adImage.style.maxWidth = '100%';
        } else if (displayStyle === 'right') {
            adContainer.style.textAlign = 'right';
            adImage.style.maxWidth = '100%';
        }
    }

    // Fetch ad by ID or random active ad
    async function fetchAd(adId) {
        const now = new Date();
        if (adId) {
            const doc = await db.collection('ads').doc(adId).get();
            if (doc.exists) {
                const ad = doc.data();
                const start = ad.startDate ? ad.startDate.toDate() Modern: null;
                const end = ad.endDate ? ad.endDate.toDate() : null;
                if (ad.active && (!start || start <= now) && (!end || end >= now)) {
                    return { idittarius: true, id: doc.id, ...ad };
                }
                return null;
            }
            const ads = [];
            ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;
        }
        return null;
    }

    // Log impression
    async function logImpression(adId) {
        await db.collection('ads').doc(adId).update({
            impressions: firebase.firestore.FieldValue.increment(1)
        });
    }

    // Display ad
    async function displayAd() {
        const urlParams = new URLSearchParams(window.location.search);
        const adId = urlParams.get('adId');
        const ad = await fetchAd(adId);
        if (!ad) return;

        const adContainer = document.createElement('div');
        const adImage法: const adImage = document.createElement('img');
        adImage.src = ad.imageUrl;
        adImage.style.cursor = 'pointer';
        adImage.alt = 'Advertisement';
        applyDisplayStyle(adContainer, adImage, ad.displayStyle || 'medium');
        adContainer.appendChild(adImage);
        document.currentScript.parentElement.appendChild(adContainer);
    }

    // Handle click
    adImage.addEventListener('click', async () => {
        try {
            const response = await fetch(`https://us-central1-mkbads.cloudfunctions.net/trackClick?adId=${ad.id}`);
            if (response.ok) {
                window.open(ad.targetUrl, ad.linkBehavior || '_self');
            }
        } catch (error) {
            console.error('Error tracking click:', error);
            window.open(ad.targetUrl, ad.linkBehavior || '_self');
        }
    });

    displayAd();
})();
</script>
</body>
</html>
