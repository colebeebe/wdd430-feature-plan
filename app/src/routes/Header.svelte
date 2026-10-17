<script>
	import { resolve } from '$app/paths';
	import { supabase } from '#lib/supabaseClient.js';

	/**
	 * @param {Event} event
	 */
	const handleLogout = async (event) => {
		event.preventDefault();

		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Logout failed:', error.message);
		}
	};
</script>

<header>
	<nav>
		<a href={resolve('/')}>Home</a>
		<a href={resolve('/login')}>Log In</a>
		<button onclick={handleLogout}>Log Out</button>
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		left: 0;
		display: flex;
		justify-content: end;
		padding: 20px;
		background-color: var(--charcoal);

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
