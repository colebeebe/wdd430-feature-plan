<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Log In</RouterLink>
      <RouterLink to="/logout">Log Out</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
  header {
    position: sticky;
    top: 0;
    left: 0;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 20px;
    background-color: var(--charcoal);
    z-index: 100;

    nav {
      display: flex;
      gap: 40px;

      a,
      button {
        display: block;
        color: var(--eggshell);
        text-decoration: none;
        padding: 10px;
        background-color: transparent;
        border: none;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
