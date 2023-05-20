import cluster from "node:cluster";
import render from "./render.js";
if (!cluster.isWorker) process.exit(1);
const workerId = cluster.worker.id;
const worker = cluster.worker;

worker.on("message", async (msg: any) => {
	console.log(`Worker ${workerId} received render request (#${msg.workId})`);
	let params = msg.data;
	let receivedBuffer = await render(params.name, params.width, params.height, params.wh, params.mag, params.blockSize, params.colour)
	console.log(`Worker ${workerId} completed render request`);
	
	cluster.worker.send({
		type: "completed",
		workId: msg.workId,
		data: receivedBuffer as Buffer
	});
});

worker.process.setMaxListeners(Infinity);
console.log(`Worker ${workerId} fully initialised`);
