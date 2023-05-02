import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { Canvas } from "canvas";
import { createHash } from "crypto";

const server = fastify({ logger: false });

function toBinary(str: string) {
	let result = "";
	// binary spaced out
	for (let i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(2) + " ";
	}

	return result.slice(0, -1);
}

server.get("/pfp", async (request: FastifyRequest, reply: FastifyReply) => {
	let query = request.query as any;
	if (query?.name === undefined) query.name = Math.random().toString(36).substring(7);
	console.log(query.name);

	let mag = 10

	let blockSize = 10 * mag;
	let across = 60 * mag;
	let down = 60 * mag;

	const canvas = new Canvas(across, down);
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

	let width = across / blockSize;
	let height = down / blockSize;
	console.log(width, height);

	for (let i = 0; i < hash.length; i++) { // colour
		if (i === 6) break;
		let colour = parseInt(hash[i], 16);
		ctx.fillStyle = `hsl(${colour * 10}, 100%, 50%)`;
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
	reply.header("Content-Type", "image/png").send(buffer);
});

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
	if (err) throw err;
	console.log(`Server listening on ${address}`);
});
