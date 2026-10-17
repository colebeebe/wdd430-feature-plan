import { games } from '#lib/games.js';

export function GET() {
	return Response.json(games);
}
