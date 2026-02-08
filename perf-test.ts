
const sessionToken = "9260908b-637c-459c-bae1-720a1f20ee44"; // Taken from check-db.ts output

const endpoints = [
    "http://localhost:3000/",
    "http://localhost:3000/dashboard",
    "http://localhost:3000/campaigns",
    "http://localhost:3000/templates",
    "http://localhost:3000/settings",
];

async function measure(url: string) {
    const start = performance.now();
    try {
        const res = await fetch(url, {
            headers: {
                // Try common cookie names for NextAuth
                "Cookie": `authjs.session-token=${sessionToken}; next-auth.session-token=${sessionToken}; __Secure-next-auth.session-token=${sessionToken}`
            }
        });
        const ttfb = performance.now() - start;
        await res.text();
        const total = performance.now() - start;

        console.log(`[${res.status}] ${url}: TTFB=${ttfb.toFixed(2)}ms, Total=${total.toFixed(2)}ms`);
        if (res.status !== 200) {
            console.warn(`    Warning: Status ${res.status}`);
        }
    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
    }
}

async function run() {
    console.log("Starting performance test...");
    // Warm up (optional, but good for JIT/caches)
    // await measure("http://localhost:3000/"); 

    for (const url of endpoints) {
        await measure(url);
    }
}

run();
