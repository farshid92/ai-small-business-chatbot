async function loadGallery() {
    try {
        const res = await fetch('/api/images');
        if (!res.ok) throw new Error('Failed to fetch images');
        const images = await res.json();

        renderRoomCards(images);
        renderGallery(images);
        populateFeatured(images);

    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadGallery();

    const btn = document.getElementById('send-btn');
    const input = document.getElementById('prompt');
    const chatHistory = document.getElementById('chat-history');

    if (!btn || !input || !chatHistory) return;

    // Clear initial placeholder on first interaction
    let isFirstMessage = true;

    async function handleSendMessage() {
        const prompt = input.value.trim();
        if (!prompt) return;

        // Clear placeholder on first message
        if (isFirstMessage) {
            chatHistory.innerHTML = '';
            isFirstMessage = false;
        }

        // Add user message to chat
        const userMsg = document.createElement('div');
        userMsg.className = 'mb-4 flex justify-end';
        userMsg.innerHTML = `<div class="bg-slate-800 text-white rounded-lg px-4 py-3 max-w-xs">${escapeHtml(prompt)}</div>`;
        chatHistory.appendChild(userMsg);

        // Clear input
        input.value = '';

        // Add loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'mb-4 flex justify-start';
        loadingMsg.innerHTML = `<div class="bg-gray-200 text-gray-700 rounded-lg px-4 py-3">Thinking...</div>`;
        chatHistory.appendChild(loadingMsg);

        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Get response from AI
        const result = await sendPrompt(prompt);
        const text = result.reply || result.output || 'Error: No response received.';

        // Remove loading message
        loadingMsg.remove();

        // Add AI response
        const aiMsg = document.createElement('div');
        aiMsg.className = 'mb-4 flex justify-start';
        aiMsg.innerHTML = `<div class="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 max-w-xs">${escapeHtml(text)}</div>`;
        chatHistory.appendChild(aiMsg);

        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Send on button click
    btn.addEventListener('click', handleSendMessage);

    // Send on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderRoomCards(images) {
    const roomConfig = {
        bedroom: {
            selector: 'bedroom-cards',
            prefix: '/images/bedroom/',
            items: [
                { title: 'Oak Nightstand', price: '$179', caption: 'Minimal bedside storage with warm oak tones.' },
                { title: 'Queen Bed Frame', price: '$649', caption: 'Modern upholstered bedframe for restful sleep.' },
                { title: 'Wardrobe', price: '$499', caption: 'Spacious wardrobe with a clean profile.' }
            ]
        },
        'living-room': {
            selector: 'living-room-cards',
            prefix: '/images/living-room/',
            items: [
                { title: 'Scandinavian Sofa', price: '$899', caption: 'Comfortable seating with clean lines.' },
                { title: 'Nordic Coffee Table', price: '$249', caption: 'Simple coffee table for everyday living.' },
                { title: 'Floor Lamp', price: '$129', caption: 'Soft ambient lighting for relaxing evenings.' }
            ]
        },
        office: {
            selector: 'office-cards',
            prefix: '/images/office/',
            items: [
                { title: 'Ergonomic Desk', price: '$329', caption: 'A modern desk designed for productive work.' },
                { title: 'Office Chair', price: '$249', caption: 'Supportive chair built for long workdays.' },
                { title: 'Walnut Bookshelf', price: '$399', caption: 'Stylish shelving for books and decor.' }
            ]
        }
    };

    Object.values(roomConfig).forEach(category => {
        const container = document.getElementById(category.selector);
        if (!container) return;

        category.items.forEach(item => {
            const imageName = item.title.replace(/\s+/g, '_');
            const matching = images.find(src => src.toLowerCase().includes(imageName.toLowerCase()));
            const src = matching || `${category.prefix}${imageName}1.jpg`;

            const card = document.createElement('div');
            card.className = 'bg-white rounded-3xl shadow-lg overflow-hidden';

            const img = document.createElement('img');
            img.src = src;
            img.alt = item.title;
            img.loading = 'lazy';
            img.className = 'w-full h-48 object-cover';

            const body = document.createElement('div');
            body.className = 'p-6';
            body.innerHTML = `
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">${item.title}</p>
                <h3 class="text-xl font-semibold mb-2">${item.title}</h3>
                <p class="text-gray-600 mb-4">${item.caption}</p>
                <p class="font-bold text-lg">${item.price}</p>
            `;

            card.appendChild(img);
            card.appendChild(body);
            container.appendChild(card);
        });
    });
}

function renderGallery(images) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const selected = [];
    const categories = ['bedroom', 'living-room', 'office'];
    categories.forEach(category => {
        const match = images.find(src => src.toLowerCase().includes(category));
        if (match) selected.push(match);
    });

    if (selected.length === 0) {
        gallery.innerHTML = '<p class="text-gray-500">No gallery images available.</p>';
        return;
    }

    selected.forEach((src, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl shadow-lg overflow-hidden';

        const img = document.createElement('img');
        img.src = src;
        img.alt = src.split('/').pop();
        img.loading = 'lazy';
        img.className = 'w-full h-64 object-cover';

        const label = document.createElement('div');
        label.className = 'p-6';
        const title = document.createElement('h3');
        title.className = 'text-xl font-semibold mb-2';
        title.textContent = categories[index].replace('-', ' ').toUpperCase();
        const caption = document.createElement('p');
        caption.className = 'text-gray-600';
        caption.textContent = 'A spotlight piece from this room collection.';

        label.appendChild(title);
        label.appendChild(caption);
        card.appendChild(img);
        card.appendChild(label);
        gallery.appendChild(card);
    });
}

function populateFeatured(images) {
    const featuredMatchers = [
        ['coffee', 'table', 'oak', 'nordic', 'coffee-table'],
        ['sofa', 'couch', 'scandinavian', 'lounge'],
        ['bookshelf', 'shelf', 'walnut', 'book']
    ];

    const titles = [
        'Nordic Oak Coffee Table',
        'Scandinavian Sofa',
        'Walnut Bookshelf'
    ];
    const descriptions = [
        'Scandinavian design with solid oak.',
        'Comfortable 3-seat fabric sofa.',
        'Minimal bookshelf for home offices.'
    ];
    const prices = ['$249', '$899', '$399'];

    const used = new Set();

    titles.forEach((title, i) => {
        const placeholder = document.getElementById(`featured-img-${i}`);
        if (!placeholder) return;

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

        if (!chosen) {
            for (const img of images) {
                if (!used.has(img)) {
                    chosen = img;
                    break;
                }
            }
        }

        if (!chosen) return;
        used.add(chosen);

        const imgEl = document.createElement('img');
        imgEl.src = chosen;
        imgEl.alt = title;
        imgEl.className = 'w-full h-48 object-cover rounded-lg mb-4';
        imgEl.loading = 'lazy';

        placeholder.innerHTML = '';
        placeholder.appendChild(imgEl);

        const titleEl = document.getElementById(`featured-title-${i}`);
        const descEl = document.getElementById(`featured-desc-${i}`);
        const priceEl = document.getElementById(`featured-price-${i}`);
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = descriptions[i];
        if (priceEl) priceEl.textContent = prices[i];
    });
}

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
        return { reply: 'Error contacting chat backend. Please try again.' };
    }
}
