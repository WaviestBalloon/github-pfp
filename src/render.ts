import { Canvas } from "canvas";
import { createHash } from "crypto";

function toBinary(str: string) {
	let result = "";
	for (let i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(2) + " ";
	}
	return result.slice(0, -1);
}

export default async function render(name: any, width: number, height: number, wh: number, mag: number, blockSize: number, colour: string | null) {
	let canvas = null;
	try {
		canvas = new Canvas(wh * mag, wh * mag);
	} catch (err) {
		console.error(err);
		throw new Error("Could not create canvas, check your magnification and width/height");
	}
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	
	let hash = createHash("md5").update(name).digest("hex");
	let binary = toBinary(hash).split(" ");
	let binaryNoSpace = binary.join("");
	let binaryArray = [];
	for (let i = 0; i < binaryNoSpace.length; i++) {
		if (i > 1) { // this "fixes" a bug where the first 2 bits are always 1
			binaryArray.push(binaryNoSpace[i]);
		}
	}
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
	return buffer;
}
