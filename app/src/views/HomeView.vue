<script setup>
import Card from '../components/Card.vue';
import games from '../data/games.json';
</script>

<template>
  <div>
    <h1>Welcome to the Oasis</h1>
    <ul>
      <Card
        v-for="game in games"
        :key="game.title"
        :game="game"
      />
    </ul>
  </div>
</template>

<style scoped>
  h1 {
    text-align: center;
    color: var(--eggshell);
    font-size: 3rem;
    margin: 40px 0;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    gap: 40px;
    justify-content: center;
  }
</style>
