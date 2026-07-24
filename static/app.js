async function loadGallery() {
    try {
        const res = await fetch('/api/images');
        if (!res.ok) throw new Error('Failed to fetch images');
        const images = await res.json();
        const gallery = document.getElementById('gallery');
        if (!gallery) return;

        if (images.length === 0) {
            gallery.innerHTML = '<p class="text-gray-500">No images found.</p>';
            return;
        }

        images.forEach(src => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow overflow-hidden';

            const img = document.createElement('img');
            img.src = src;
            img.alt = src.split('/').pop();
            img.loading = 'lazy';
            img.className = 'w-full h-48 object-cover';

            card.appendChild(img);
            gallery.appendChild(card);
        });

        // Populate featured product placeholders with first three images
        populateFeatured(images);

    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', loadGallery);

function populateFeatured(images) {
    // Keywords to match images to each featured card
    const featuredMatchers = [
        ['coffee', 'table', 'oak', 'nordic', 'coffee-table'],
        ['sofa', 'couch', 'scandinavian', 'lounge'],
        ['bookshelf', 'shelf', 'walnut', 'book']
    ];

    const used = new Set();

    for (let i = 0; i < 3; i++) {
        const placeholder = document.getElementById(`featured-img-${i}`);
        if (!placeholder) continue;

        // Find an image that matches keywords for this slot
        const keywords = featuredMatchers[i] || [];
        let chosen = null;

        for (const img of images) {
            if (used.has(img)) continue;
            const name = img.toLowerCase();
            if (keywords.some(k => name.includes(k))) {
                chosen = img;
                break;
            }
        }

        // Fallback: first unused image
        if (!chosen) {
            for (const img of images) {
                if (!used.has(img)) {
                    chosen = img;
                    break;
                }
            }
        }

        if (!chosen) continue;
        used.add(chosen);

        const imgEl = document.createElement('img');
        imgEl.src = chosen;
        imgEl.alt = chosen.split('/').pop();
        imgEl.className = 'w-full h-48 object-cover rounded-lg mb-4';
        imgEl.loading = 'lazy';

        placeholder.innerHTML = '';
        placeholder.appendChild(imgEl);
    }
}

// Chat UI wiring
async function sendPrompt(prompt) {
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!res.ok) throw new Error('Chat request failed');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        return { reply: 'Error contacting chat backend.' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('send-btn');
    const input = document.getElementById('prompt');
    const respEl = document.getElementById('response');

    if (!btn || !input || !respEl) return;

    btn.addEventListener('click', async () => {
        const prompt = input.value.trim();
        if (!prompt) return;
        respEl.innerHTML = '<p class="text-gray-600">Thinking...</p>';
        const result = await sendPrompt(prompt);
        const text = result.reply || result.output || JSON.stringify(result);
        respEl.innerHTML = `<p>${text}</p>`;
    });
});
