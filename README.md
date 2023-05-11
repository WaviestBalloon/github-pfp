<img src="https://gitpfp.wav.blue/pfp?mag=2&name=github-pfp">

# github-pfp
An attempt to replicate GitHub's default profile pictures in under 100 lines (excluding junk) using Fastify and Canvas

## <img src="https://gitpfp.wav.blue/pfp?mag=0.3&name=installation"> Installation
1. Clone the repository
2. Run `npm i` to install dependencies
3. Run `./start.sh` to transpile and start the server (This will rebuild the source if it is daemonized)

## <img src="https://gitpfp.wav.blue/pfp?mag=0.3&name=usage"> Usage
Go to the root of the server (default: `localhost:3000`) for usage instructions after running the server

### <img src="https://gitpfp.wav.blue/pfp?mag=0.3&name=server parameters"> Server parameters
The default launch parameters specified in `start.sh` are: 
```bash
node . --port 3000 --cache-removal-timer 285000 --use-cluster true
```

| Parameter                       | What it does                                                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--port`: Number                | Tells Fastify what port to run the webserver on, default: `3000`                                                              |
| `--cache-removal-timer`: Number | Time in milliseconds to remove cached rendered profile pictures, default: `285000` (4.75 minutes)                             |
| `--use-cluster`: Boolean        | Enables/Disables Node.js workers/cluster, it has been implemented to spread render requests across CPU cores, default: `true` |

Just appending `/pfp` onto the root URL (like: http://gitpfp.wav.blue/pfp / http://127.0.0.1:3000/pfp ) without any parameters will generate a random string with 60 `wh` (6 pixels across and down) and 10 magnification

- `name` - The text to base the profile picture on
- `mag` - Image magnification of the output image
- `wh` - Width and Height value of the output image
- `colour` - Hexadecimal colour code for the pixels of the output image (Without `#`, e.g. `?colour=e8c8e8`)

> **Note**:
> For the best output, make sure `mag` and `wh` are even numbers (like `20` not `27`, `39`, `15.323421` etc)

## <img src="https://gitpfp.wav.blue/pfp?mag=0.3&name=examples"> Examples
| Output                                                   | Request                                |
| -------------------------------------------------------- | -------------------------------------- |
| <img src="https://gitpfp.wav.blue/pfp?mag=1">            | `gitpfp.wav.blue/pfp?mag=1`            |
| <img src="https://gitpfp.wav.blue/pfp?mag=1&wh=100">     | `gitpfp.wav.blue/pfp?mag=1&wh=100`     |
| <img src="https://gitpfp.wav.blue/pfp?mag=1&wh=200">     | `gitpfp.wav.blue/pfp?mag=1&wh=200`     |
| <img src="https://gitpfp.wav.blue/pfp?mag=1&name=meow">  | `gitpfp.wav.blue/pfp?mag=1&name=meow`  |

## <img src="https://gitpfp.wav.blue/pfp?mag=0.3&name=resources"> Resources
- GitHub for really cool profile pictures
- GitHub Co-Pilot for holding my hand with the super complex mathamatical stuff
- [United States Naval Academy](https://www.usna.edu/Users/cs/roche/courses/s15si335/proj1/files.php%3Ff=names.txt.html) for the name list sample (`fillernames.txt`)
