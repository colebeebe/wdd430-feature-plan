<script>
	import { resolve } from '$app/paths';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	/**
	 * @param {SubmitEvent} event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		loading = true;

		setTimeout(() => {
			loading = false;
		}, 3000);

		email = '';
		password = '';
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}

		errorMessage = 'Incorrect username or password.';
	};

	/**
	 * @param {Event} event
	 */
	const handleCloseBanner = (event) => {
		event.preventDefault();
		errorMessage = '';
	};
</script>

{#if errorMessage}
	<div class="error-banner">
		<div class="message-content">
			<p>Error logging in</p>
			<p class="error-message">{errorMessage}</p>
		</div>
		<button onclick={handleCloseBanner}>X</button>
	</div>
{/if}

<div class="content">
	<div class="left-content">
		<h1>Welcome Back</h1>
		<p>Haven't joined us yet? <a href={resolve('/')}>Create a new account</a>.</p>
		<p><a href={resolve('/')}>Return</a> without logging in.</p>
	</div>
	<div class="right-content">
		{#if loading}
			<h2>Logging In...</h2>
		{:else}
			<form id="login-form" onsubmit={handleSubmit}>
				<div class="form-section">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" bind:value={email} />
				</div>
				<div class="form-section">
					<label for="password">Password</label>
					<input id="password" name="password" type="password" bind:value={password} />
				</div>
				<button type="submit">Log In</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.error-banner {
		position: fixed;
		width: 600px;
		left: 50%;
		transform: translateX(-50%);
		top: 20px;
		background-color: var(--blush);
		border-left: 5px solid var(--brick);
		border-radius: 5px;
		padding: 10px;
		display: flex;
		align-items: center;

		.message-content {
			flex: 1;

			p {
				font-size: 1.2rem;
				color: var(--velvet);
				font-weight: bold;
				font-family: Arial, Helvetica, sans-serif;

				&.error-message {
					font-weight: lighter;
					font-family: 'Times New Roman', Times, serif;
				}
			}
		}

		button {
			height: 30px;
			aspect-ratio: 1 / 1;
			background-color: transparent;
			cursor: pointer;
			border: none;
			border-radius: 5px;
			font-weight: bold;
			color: var(--velvet);

			&:hover {
				background-color: var(--velvet);
				color: var(--blush);
			}
		}
	}

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
					color: var(--eggshell);
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

			button[type='submit'] {
				padding: 8px;
				border-radius: 8px;
				font-size: 1.5rem;
				font-weight: bold;
				border: none;
				background-color: var(--amber);
				border: 3px solid transparent;
				cursor: pointer;
				color: var(--charcoal);
				transition:
					background-color 0.5s ease,
					border 0.5s ease,
					color 0.5s ease;

				&:hover {
					background-color: transparent;
					border: 3px solid var(--amber);
					color: var(--amber);
				}
			}
		}
	}
</style>
