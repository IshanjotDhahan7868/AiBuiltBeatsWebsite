
document.addEventListener('DOMContentLoaded', () => {
  // Load beats
  const beatGrid = document.getElementById('beatGrid');
  const beats = [
    {
      title: 'Beamer Crease',
      image: 'assets/beats/beamer crease.png',
      audio: 'assets/beats/beamer crease.mp3'
    },
    {
      title: 'Deep Pockets',
      image: 'assets/beats/deep-pockets.mp4',
      audio: 'assets/beats/deep-pockets.mp3'
    },
    {
      title: 'In Space',
      image: 'assets/beats/in space.png',
      audio: 'assets/beats/in space.mp3'
    }
  ];

  beats.forEach(beat => {
    const card = document.createElement('div');
    card.className = 'beat';
    card.innerHTML = `
      <h3>${beat.title}</h3>
      <img src="${beat.image}" alt="${beat.title}" />
      <audio controls><source src="${beat.audio}" type="audio/mp3"></audio>
    `;
    beatGrid.appendChild(card);
  });

  // Load blog posts
  fetch('assets/blog/blog.json')
    .then(res => res.json())
    .then(posts => {
      const container = document.getElementById('blogPosts');
      posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'blog-post';
        div.innerHTML = `
          <h3>${post.title}</h3>
          <p><em>${post.date}</em></p>
          <p>${post.excerpt}</p>
        `;
        container.appendChild(div);
      });
    });

  // Newsletter
  document.getElementById('newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('newsletterMsg').textContent = 'Thank you for subscribing!';
  });

  // Contact form
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contactMsg').textContent = 'Message sent successfully!';
  });
});



(async function () {
  const $grid = document.getElementById('beat-grid');
  const $search = document.getElementById('search');
  const $sort = document.getElementById('sort');
  const $chips = document.getElementById('tag-chips');

  let beats = [];
  try {
    const res = await fetch('beats.json', { cache: 'no-store' });
    beats = await res.json();
  } catch (e) {
    console.error('Failed to load beats.json', e);
  }

  // Popular tags
  const tagCount = {};
  beats.forEach(b => (b.tags || []).forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
  const topTags = Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([t])=>t);
  let activeTag = null;

  function chip(label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className = 'tag';
    btn.onclick = () => {
      activeTag = (activeTag === label) ? null : label;
      render();
    };
    return btn;
  }
  $chips.innerHTML = '';
  topTags.forEach(t => $chips.appendChild(chip(t)));

  function sortFn(a, b) {
    const v = $sort.value;
    if (v === 'title') return a.title.localeCompare(b.title);
    if (v === 'bpm-asc') return (a.bpm||0) - (b.bpm||0);
    if (v === 'bpm-desc') return (b.bpm||0) - (a.bpm||0);
    return 0; // "newest" = current order
  }

  function matchQuery(b) {
    const q = ($search.value || '').trim().toLowerCase();
    if (!q && !activeTag) return true;
    const hay = [
      b.title || '',
      b.key || '',
      String(b.bpm || ''),
      ...(b.tags || [])
    ].join(' ').toLowerCase();
    const tagOk = activeTag ? (b.tags || []).includes(activeTag) : true;
    return hay.includes(q) && tagOk;
  }

  function card(b) {
    const el = document.createElement('article');
    el.className = 'beat-card';
    el.innerHTML = `
      <div class="beat-media">${b.cover ? `<img src="${b.cover}" alt="${b.title || 'cover'}" loading="lazy">` : ''}</div>
      <div class="beat-body">
        <h3>${b.title || 'Untitled'}</h3>
        <div class="beat-meta">
          <span>${b.bpm ? b.bpm + ' BPM' : ''}</span>
          <span>${b.key || ''}</span>
        </div>
        <audio controls src="${b.audio || ''}"></audio>
        <div class="tags">${(b.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="license-row">
          ${(b.licenses||[]).map(L => `
            <a class="license-btn" href="${L.stripe || L.paypal || '#'}" target="_blank" rel="noopener">
              Buy ${L.name} — $${L.price}
            </a>
          `).join('')}
        </div>
      </div>
    `;
    return el;
  }

  function render() {
    const list = beats.filter(matchQuery).sort(sortFn);
    $grid.innerHTML = '';
    list.forEach(b => $grid.appendChild(card(b)));
  }

  $search?.addEventListener('input', render);
  $sort?.addEventListener('change', render);
  render();
})();

