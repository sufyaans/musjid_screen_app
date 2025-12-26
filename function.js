/**
 * Malawi Dashboard Master Controller
 * Location: Blantyre, Malawi (Central Africa Time)
 */

function updateDashboard() {
    const now = new Date();
    const malawiTimezone = 'Africa/Blantyre';

    // --- 1. MALAWI CLOCK & DATE (TOP LEFT TILE) ---
    // Time formatted for Poppins Bold 35px
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false, 
        timeZone: malawiTimezone 
    };
    
    // Date formatted for Poppins Regular 13px
    const dateOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        timeZone: malawiTimezone 
    };

    const timeString = now.toLocaleTimeString('en-GB', timeOptions);
    const dateString = now.toLocaleDateString('en-GB', dateOptions);

    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;


    // --- 2. DYNAMIC PRAYER SWITCHING (TALL TILE) ---
    const malawiNow = new Date(now.toLocaleString('en-US', { timeZone: malawiTimezone }));
    
    // Targeted Prayer Times (Iqaamah)
    const prayerTimes = [
        { name: "FAJR", hour: 6, minute: 15 },
        { name: "ZUHR", hour: 13, minute: 15 },
        { name: "ASR", hour: 15, minute: 15 },
        { name: "MAGHRIB", hour: 16, minute: 10 },
        { name: "ESHA", hour: 19, minute: 0 }
    ];

    let nextPrayer = null;
    let targetTime = null;

    // Find the next upcoming prayer
    for (let prayer of prayerTimes) {
        let pTime = new Date(malawiNow);
        pTime.setHours(prayer.hour, prayer.minute, 0, 0);
        
        if (pTime > malawiNow) {
            nextPrayer = prayer.name;
            targetTime = pTime;
            break;
        }
    }

    // Overnight Logic: If after Esha, set target to tomorrow's Fajr
    if (!nextPrayer) {
        nextPrayer = "FAJR";
        targetTime = new Date(malawiNow);
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(prayerTimes[0].hour, prayerTimes[0].minute, 0, 0);
    }

    // Update Label (e.g., MAGHRIB IN)
    const labelElement = document.getElementById('next-prayer-name');
    if (labelElement) labelElement.textContent = `${nextPrayer} IN`;

    // --- 3. COUNTDOWN CALCULATION ---
    let diff = targetTime - malawiNow;
    if (diff < 0) diff = 0;

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const countdownElement = document.querySelector('.countdown-time');
    if (countdownElement) {
        countdownElement.textContent = `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // --- 4. FOOTER LIVE CLOCK ---
    // const footerClock = document.getElementById('footer-current-time');
    // if (footerClock) {
    //     const footerOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: malawiTimezone };
    //     footerClock.innerHTML = `🕌 ${now.toLocaleTimeString('en-US', footerOptions)}`;
    // }
}

/**
 * BBC Style Announcement Cycler (Footer Tile)
 */
function initAnnouncementBar() {
    const headlines = document.querySelectorAll('.headline');
    let currentIndex = 0;

    if (headlines.length === 0) return;

    function cycleMessages() {
        // Hide current message
        headlines[currentIndex].classList.remove('message-active');

        // Increment index
        currentIndex = (currentIndex + 1) % headlines.length;

        // Show next message
        setTimeout(() => {
            headlines[currentIndex].classList.add('message-active');
        }, 100); 
    }

    // Switch message every 10 seconds
    setInterval(cycleMessages, 10000);
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Start Clock and Countdown
    updateDashboard();
    setInterval(updateDashboard, 1000);

    // Start Footer Announcements
    initAnnouncementBar();
});