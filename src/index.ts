import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { Canvas } from "canvas";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nameList = readFileSync(join(__dirname, `../fillernames.txt`), "utf-8").split("\n");
const server = fastify({ logger: false });

function toBinary(str: string) {
	let result = "";
	for (let i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(2) + " ";
	}
	return result.slice(0, -1);
}

server.get("/pfp", async (request: FastifyRequest, reply: FastifyReply) => { // TODO: caching rendered images
	let startTimer = Date.now();
	let query = request.query as any;
	if (query?.name === undefined) query.name = Math.random().toString(36).substring(7);
	console.log(query);

	let mag = query?.mag ?? 10;
	if (mag > 100) {
		reply.code(400).send("Magnification cannot be greater than 100");
	}
	let wh = query?.wh ?? 30;
	if (wh > 200) {
		reply.code(400).send("The amount of Pixels for Width/height cannot be greater than 200"); // after 200, the output data is too small to fill the output image
	}
	wh *= 2;
	let colour = query?.colour ?? null;
	if (colour !== null) {
		if (colour.length !== 6) {
			reply.code(400).send("Colour must be 6 characters long (Hexadecimal format, eg. e8c8e8)");
		}
	}

	let blockSize = 10 * mag;
	let width = (wh * mag) / blockSize; // TODO: refactor this area, cut down on variables
	let height = (wh * mag) / blockSize;
	console.log(width, height);

	let canvas = null;
	try {
		canvas = new Canvas(wh * mag, wh * mag);
	} catch (err) {
		console.error(err);
		reply.code(400).send("Could not create canvas, check your magnification and width/height");
	}
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	
	let hash = createHash("md5").update(query.name).digest("hex")
	let binary = toBinary(hash).split(" ");
	let binaryNoSpace = binary.join("");
	let binaryArray = [];
	for (let i = 0; i < binaryNoSpace.length; i++) {
		binaryArray.push(binaryNoSpace[i]);
	}
	console.log(binary);
	console.log(binaryNoSpace);
	console.log(binaryArray);

	if (colour === null) {
		for (let i = 0; i < hash.length; i++) { // colour
			if (i === 6) break;
			let colour = parseInt(hash[i], 16);
			ctx.fillStyle = `hsl(${colour * 10}, 100%, 50%)`;
		}
	} else {
		ctx.fillStyle = `#${colour}`;
	}
	for (let i = 0; i < height * (width / 2); i++) { // draw pixels
		if (binaryArray[i] === "1") {
			ctx.fillRect(
				(i % (width / 2)) * blockSize, Math.floor(i / (width / 2)) * blockSize, 
				blockSize, blockSize
			);
			ctx.fillRect(
				(width - 1 - (i % (width / 2))) * blockSize, Math.floor(i / (width / 2)) * blockSize, 
				blockSize, blockSize
			);
		}
	}

	const buffer = canvas.toBuffer();
	console.log(`Completed in ${Date.now() - startTimer}ms`);
	reply.header("Content-Type", "image/png").header("X-Completed-In", Date.now() - startTimer).send(buffer);
});

server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
	let randomName = nameList[Math.floor(Math.random() * nameList.length)];
	let randomMag = Math.floor(Math.random() * 10) + 1;
	let randomWh = Math.floor(Math.random() * 80) + 30;

	let example;
	if (Math.floor(Math.random() * 2) === 1) {
		let randomColour = Math.floor(Math.random() * 16777215).toString(16);
		example = `/pfp?name=${randomName}&mag=${randomMag}&wh=${randomWh}&colour=${randomColour}`;
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
server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
	if (err) throw err;
	console.log(`Server listening on ${address}`);
});
