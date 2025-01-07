import database from 'infra/database.js';

async function status(request, response) {
	const updated_at = new Date().toISOString();
	const versionResponse = await database.query('SHOW server_version');
	const versionValue = versionResponse.rows[0].server_version;

	const maxConnectionsResponse = await database.query('SHOW max_connections');
	const maxConnectionsValue = maxConnectionsResponse.rows[0].max_connections;
	
	const databaseName = process.env.POSTGRES_DB;
	const openedConnectionsResponse = await database.query({
		text: "SELECT COUNT(*)::int FROM pg_stat_activity  WHERE datname= $1",
		values: [databaseName]
	});
	const openedConnectionsValue = openedConnectionsResponse.rows[0].count;

	response.status(200).json({
		updated_at: updated_at,
		dependencies: {
			database: {
				version: versionValue,
				max_connections: parseInt(maxConnectionsValue),
				opened_connections: openedConnectionsValue,
			},
			webserver: {},
		},
	});
}

export default status;

