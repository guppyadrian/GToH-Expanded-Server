Guide to setup server:

1. Port forward on port 80
	- Search up a guide on how to port forward and set the port to 80

2. Add your GToH-Expanded to the client folder
	- This step may already be completed, check the client folder
	- Drag everything in your GToH-Expanded folder into the client folder
	- DO NOT move the GToH-Expanded root folder in, only move what is INSIDE the folder.
	- When you open the client folder index.html should be there.

3. Download node.js
	- Link is here https://nodejs.org/en
	- You may have to restart your pc after installing
	- You can test if it is installed by opening command prompt and typing "node", it should say "Welcome to Node.js"

3. Setup configuration
	- Open config.js and change the values to true or false

5. Open STARTSERVER.bat
	- It will open a command prompt with the message 'Starting Up...'
	- It will give the message 'Server is online!' when players can join
	- if you can't open the STARTSERVER.bat for whatever reason, open command prompt in that directory and enter 'node .'

Troubleshooting:

If players can't join, the server hoster should go to the url 'localhost:80' and see if it works. If it works, it is probably a problem with port forwarding. If not, the server probably isn't running
If you get the error 'no such file or directory', you did step 2 incorrectly.
If the page is white and only says 'you can play old game here' you did step 2 incorrectly, the scripts folder couldn't be found

Extra Notes:
player data is stored based on the ip, not the server. If your IP changes, all player data is erased.
Usernames longer than 15 characters will be cut off for other players.
You can include special characters in your username.
The server will run off your IP address, don't share it publicly!