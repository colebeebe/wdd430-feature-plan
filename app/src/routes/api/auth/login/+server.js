/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { email, password } = await request.json();

	await new Promise((resolve) => setTimeout(resolve, 2000));

	if (email === 'user1@email.com' && password === 'Passw0rd!') {
		return Response.json({
			ok: true,
			message: 'user logged in'
		});
	}

	return Response.json({
		ok: false,
		message: 'Incorrect username or password'
	});
}
