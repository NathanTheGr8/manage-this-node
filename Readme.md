# manage-this-node

NodeJS version of [Muximux](https://github.com/mescon/Muximux/) and [Managethis](https://github.com/Tenzinn3/Managethis)

Forked from [oneDr0p](https://github.com/onedr0p/manage-this-node)

Getting Started
---------------

### Prerequisites
- [Node.js](http://nodejs.org) v4.2.x
- [Git](https://git-scm.com/downloads) (optional)

### Installation

```bash
# Clone the repository or download the ZIP and extract it
git clone https://github.com/onedr0p/manage-this-node
```

```bash
# Install dependencies
cd manage-this-node
npm install
```

### Upgrading
It's a good idea to run `npm install` to avoid any problems.

### Configuration

```bash
# Copy config.json.template to config.json
cp config.json.template config.json
```

In `config.json` fill in the `port` you want to use if you don't want to use port `3000`.

Everything else can be handled when the app is running via the settings menu.

**Important note**: If you must change the `config.json` file by hand, restart the app to see the changes.

Basic auth is available by passing `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` through environment variables.

```bash
BASIC_AUTH_USER=user BASIC_AUTH_PASSWORD=password npm start
```

### Start the app

```bash
# Start the app
npm start
```

Open `localhost:3000` in your browser to see the app.

### Running forever
To have the app run forever in the background

```bash
# Install forever
npm install forever -g

# Run
forever start ./bin/www

# Stop
forever stop ./bin/www
```

Goto `localhost:3000` to see the app.

### Docker
1. Install [Docker](https://www.docker.com/)

2. Make a directory to store the config file and copy the template from the orginal repo, naming it config.json.

3. Run the container, pointing to the directory with the config file. This should now pull the image from Docker hub:
  ```
  docker run -d -p 3000:3000 \
  --name="manage-this-node" \
  -v <path to config folder>:/config \
  --restart="always" \
  nathanthegr8/manage-this-node
  ```

## Port Conflicts
If you run into a port conflict trying to run on 3000, for example if you're running [Plex Requests](https://github.com/lokenx/plexrequests-meteor), it is simple to modify the port forwarding:

```-p 3001:3000```

App Specific Workarounds
---------------
**Emby**  
By Default Emby sends a header that prevents loading in an iframe.   

Windows:
* Edit `C:\Users\<username>\AppData\Roaming\MediaBrowser-Server\config\system.xml`  
* Look for `<DenyIFrameEmbedding>true</DenyIFrameEmbedding>` replace `true` with `false`  
* Should look like `<DenyIFrameEmbedding>false</DenyIFrameEmbedding>`  
* Save the file and restart Emby  

Additional Information
---------------

### Contributing
Feel free to fork this and submit a PR with your code changes.

### Notes
It is strongly advised if this WebApp is open to the outside world use Basic Auth (.htpasswd / .htaccess). Your URLs (and passwords) are exposed in the HTML source.

### Known Issues
- Problem: Nothing is displaying, Solution: Disable Adblock/uBlock and Ghostery/Privacy Badger for the website.