import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import render from "./render.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nameList = readFileSync(join(__dirname, `../fillernames.txt`), "utf-8").split("\n");
const server = fastify({ logger: false });
let portNumber = 3000;
let cacheRemovalTimer = 285000;
let cache: { query: any, buffer: Buffer; }[] = [];
process.argv.forEach((val, index) => {
	if (index < 2) return;
	switch (val) {
		case "--port": portNumber = parseInt(process.argv[index + 1]);
		case "--cache-removal-timer": cacheRemovalTimer = parseInt(process.argv[index + 1]);
		default: return;
	}
});

server.get("/pfp", async (request: FastifyRequest, reply: FastifyReply) => { // TODO: caching rendered images
	let startTimer = Date.now();
	let query = request.query as any;
	for (let i = 0; i < cache.length; i++) {
		if (JSON.stringify(cache[i].query) === JSON.stringify(query)) {
			console.log(`Found ${query?.name} in cache - ${cache.length} items remaining in cache`);
			return reply.header("Content-Type", "image/png").header("X-Completed-In", Date.now() - startTimer).header("X-Returned-Cache", true).send(cache[i].buffer);
		}
	}
	if (query?.name === undefined) query.name = Math.random().toString(36).substring(7);
	console.log(query);

	let mag = query?.mag ?? 10;
	if (mag > 100) {
		return reply.code(400).send("Magnification cannot be greater than 100");
	}
	let wh = query?.wh ?? 60;
	if (wh > 200) {
		return reply.code(400).send("The amount of Pixels for Width/height cannot be greater than 200"); // after 200, the output data is too small to fill the output image
	}
	//wh *= 2;
	let colour = query?.colour ?? null;
	if (colour !== null) {
		if (colour.length !== 6) {
			return reply.code(400).send("Colour must be 6 characters long (Hexadecimal format, eg. e8c8e8)");
		}
	}

	let blockSize = 10 * mag;
	let width = (wh * mag) / blockSize; // TODO: refactor this area, cut down on variables
	let height = (wh * mag) / blockSize;
	console.log(width, height);

	if (wh * mag > 10000) {
		return reply.code(400).send(`Width/Height and/or Magnification collectively exceeds 10000 pixels (${wh * mag}) (Try lowering your magnification or width/height, or both)`);
	}
	
	console.log(query?.name, width, height, wh, mag, blockSize, colour)
	let buffer = await render(query?.name, width, height, wh, mag, blockSize, colour);

	cache.push({ query: query, buffer: buffer });
	setTimeout(() => {
		for (let i = 0; i < cache.length; i++) {
			if (cache[i].query === query) {
				cache.splice(i, 1);
				break;
			}
		}
		console.log(`Removed ${query?.name} from cache - ${cache.length} items remaining in cache`);
	}, cacheRemovalTimer);
	console.log(`Completed in ${Date.now() - startTimer}ms`);
	reply.header("Content-Type", "image/png").header("X-Completed-In", Date.now() - startTimer).send(buffer);
});
server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
	let randomName = nameList[Math.floor(Math.random() * nameList.length)];
	let randomMag = Math.floor(Math.random() * 10) + 1;
	let randomWh = Math.floor(Math.random() * 80) + 30;
	let example;
	if (Math.floor(Math.random() * 2) === 1) {
		example = `/pfp?name=${randomName}&mag=${randomMag}&wh=${randomWh}&colour=${Math.floor(Math.random() * 16777215).toString(16)}`;
	} else {
		example = `/pfp?name=${randomName}&mag=${randomMag}&wh=${randomWh}`;
	}

	reply.header("Content-Type", "text/json").send({
		"randomExample": example,
		"query": {
			"name": "string",
			"mag": "number",
			"wh": "number",
			"colour": "string"
		}
	});
});

server.listen({ port: portNumber, host: "0.0.0.0" }, (err, address) => {
	if (err) throw err;
	console.log(`Server listening on ${address}`);
});
