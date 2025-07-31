
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
