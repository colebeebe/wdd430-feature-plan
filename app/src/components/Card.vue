<script setup>
defineProps({
  game: {
    type: Object,
    required: true
  }
});

const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  const rotateY = (x - 0.5) * 30;
  const rotateX = (0.5 - y) * 30;

  card.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.05)
  `;
};

const handleMouseLeave = (e) => {
  e.currentTarget.style.transform = '';
};
</script>

<template>
  <li class="game-card" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <img src="/images/placeholder.webp" alt="placeholder" />
    <div class="game-info">
      <h2>{{ game.title }}</h2>
      <p class="game-dev">{{ game.developer }} | {{ game.publisher }}</p>
      <p class="release-year">Released: {{ game.year }}</p>
      <p class="game-genre">{{ game.genres[0] }}</p>
    </div>
  </li>
</template>

<style scoped>
  li {
    padding: 15px;
    width: 204px;
    height: 350px;
    color: var(--eggshell);
    background-color: var(--smoke);
    border-radius: 10px;
    border: 8px solid var(--amber);
    cursor: pointer;
    transition: transform 0.15s ease-out;
    will-change: transform;

    img {
      width: 100%;
      height: auto;
    }

    .game-info {
      h2 {
        text-align: center;
      }
    }
  }
</style>
