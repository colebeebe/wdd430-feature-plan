<script>
  import { resolve } from '$app/paths';
</script>

<div class="content">
  <div class="left-content">
    <h1>Welcome Back</h1>
    <p>Haven't joined us yet? <a href={resolve('/')}>Create a new account</a>.</p>
    <p><a href={resolve('/')}>Return</a> without logging in.</p>
  </div>
  <form id="login-form">
    <div class="form-section">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" />
    </div>
    <div class="form-section">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" />
    </div>
    <button type="submit">Log In</button>
  </form>
</div>

<style>
  .content {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('/images/log-in-background.jpg');
    background-size: cover;

    .left-content {
      color: var(--eggshell);
      font-size: 2rem;
      padding-right: 30px;
      height: 200px;
      border-right: 2px solid rgba(255, 255, 255, 0.2);

      a {
        background-color: var(--blush);
        color: var(--charcoal);
      }
    }

    form {
      background-color: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(5px);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 40px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-left: 30px;

      .form-section {
        display: flex;
        flex-direction: column;

        label {
          color: var(--eggshell);
          font-weight: bold;
          font-size: 1.5rem;
        }

        input {
          font-size: 1.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
          border: none;
          border-radius: 8px;
          padding: 8px;
          margin: 5px 0;
          min-width: 400px;

          &:focus {
            outline: 3px solid var(--sunrays);
          }
        }
      }

      button[type="submit"] {
        padding: 8px;
        border-radius: 8px;
        font-size: 1.5rem;
        font-weight: bold;
        border: none;
        background-color: var(--amber);
        border: 3px solid transparent;
        cursor: pointer;
        color: var(--charcoal);
        transition: background-color 0.5s ease, border 0.5s ease, color 0.5s ease;

        &:hover {
          background-color: transparent;
          border: 3px solid var(--amber);
          color: var(--amber);
        }
      }
    }
  }
</style>
