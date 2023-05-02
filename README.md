<img src="https://gitpfp.wav.blue/pfp?mag=2&name=github-pfp">

# github-pfp
An attempt to replicate GitHub's default profile pictures in under 100 lines (excluding junk) using Fastify and Canvas

## <img src="https://gitpfp.wav.blue/pfp?mag=0.2&name=installation"> Installation
1. Clone the repository
2. Run `npm i` to install dependencies
3. Run `./start.sh` to transpile and start the server

## <img src="https://gitpfp.wav.blue/pfp?mag=0.2&name=usage"> Usage
Go to the root of the server (default: `localhost:3000`) for usage instructions after running the server

- `name` - The text to base the profile picture on
- `mag` - Image magnification of the output image
- `wh` - Width and Height value of the output image
- `colour` - Hexadecimal colour code for the pixels of the output image (Without `#`, e.g. `?colour=e8c8e8`)

> **Note**:
> For the best output, make sure `mag` and `wh` are even numbers (like `20` not `27`, `39`, `15.323421` etc)

## <img src="https://gitpfp.wav.blue/pfp?mag=0.2&name=examples"> Examples
<img src="https://gitpfp.wav.blue/pfp?mag=1"> (`gitpfp.wav.blue/pfp?mag=1`)
<img src="https://gitpfp.wav.blue/pfp?mag=1&wh=50"> (`gitpfp.wav.blue/pfp?mag=1&wh=50`)
<img src="https://gitpfp.wav.blue/pfp?mag=1&wh=100"> (`gitpfp.wav.blue/pfp?mag=1&wh=100`)

## <img src="https://gitpfp.wav.blue/pfp?mag=0.2&name=resources"> Resources
- GitHub for really cool profile pictures
- GitHub Co-Pilot for holding my hand with the super complex mathamatical stuff
- [United States Naval Academy](https://www.usna.edu/Users/cs/roche/courses/s15si335/proj1/files.php%3Ff=names.txt.html) for the name list sample (`fillernames.txt`)
