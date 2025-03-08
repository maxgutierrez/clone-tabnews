test('GET /api/v1/status shoud return 200', async () => {
	const response = await fetch('http://localhost:3000/api/v1/status');
	expect(response.status).toBe(200);

	const responseBody = await response.json();

	const responseBodyKeys = Object.keys(responseBody);
	// expect(responseBodyKeys.length).toBe(2);

	const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
	expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
	expect(responseBody.updated_at.slice(0, 10)).toEqual(new Date().toISOString().slice(0, 10));

	const pgVersion = responseBody.dependencies.database.version;
	expect(pgVersion).toBe('16.0');

	const maxConnections = responseBody.dependencies.database.max_connections;
	expect(maxConnections).toBe(100);

	const openedConnections = responseBody.dependencies.database.opened_connections;
	expect(openedConnections).toBeGreaterThanOrEqual(1);
});

