// Import and create a discord instance
const Discord = require('discord.js');
const { prefix, btoken } = require('./config.json');
const client = new Discord.Client();

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// I left the tutorials comments here. Pretty much a copy paste from the google node.js guide

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
// Load client secrets from a local file.
fs.readFile('client_id.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
	// Authorize a client with credentials, then call the Google Sheets API.
	authorize(JSON.parse(content), listMajors);
});
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const { client_secret, client_id } = credentials.web;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret[0]);
	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error while trying to retrieve access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}
/**
 * When you dont have any function in line21 then things go wrong. So this was the example. It is left here because it never seems to do anything except prevent a crash!!! 
 * 
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
	const sheets = google.sheets({ version: 'v4', auth });
	sheets.spreadsheets.values.get({
		spreadsheetId: 'any spreadsheet, googles example is above',
		range: 'A1:C3',
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length) {
			console.log('Name, Major:');
			rows.map((row) => {
				console.log(`${row[0]}, ${row[2]}`);
			});
		}
		else {
			console.log('No data found.');
		}
	});
}
// When the client is ready run this code, only triggers once
// console.log prints to the cmd box you ran the bot from. 
client.once('ready', () => {
	console.log('I live!');
});
// Notice .on and .once above, on stays on, once occours once
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	// Slice prefix away, then split at each empty space. Forms an array. / +/ removes extra white spaces
	const args = message.content.slice(prefix.length).split('/ +/');
	// remove the first element from the args array and place it in command
	const command = args.shift().toLowerCase();
	
	// dkp can be anything, it is what you type after the prefix, which in this case is ? So we message the bot ?dkp for anything to happen
	if (command === 'dkp') {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
		const id = message.author.id;
		// Discord is a hero and gives everyone uniqueID's so these can double as a key in your spreadsheet
		const auth = 'THIS IS YOUR MAIN API KEY FROM GOOGLE. YOU MAY NEED TO ENABLE GOOGLE SCRIPTS API';
		const sheets = google.sheets({ version: 'v4', auth });
		sheets.spreadsheets.values.get({
			spreadsheetId: 'THIS IS THE WORKING SPREADSHEETS ID. LOOKS LIKE 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms IN THE URL',
			range: 'DKP!A1:C100',// HERE DKP! referes to the spreadsheet tab. Delete DKP! for default tab. A1:C100 means it reads from cell A1 to C100. Can be whatever you need
		},
		(err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			const rows = res.data.values;
			if (rows.length) {
				const idees = [];
				for (let i = 0; i < rows.length; i++) {
					idees.push(rows[i]);
					// Possibly inefficient but we take all the data from each of the rows of cells and add it as an array to an array. A1, B1, C1 become [0, 1, 2] in the array
					// So in column A we store the discordID so that it can be compared
					// Column B is your game name for easy identification by humans
					// Column C is the DKP score you wanted to find out
				}
				let idConfirmed = false;
				for (const key in idees) {
					const identity = idees[key][0];
					if (identity == id) {
						const gameName = rows[key][1];
						const dkp = rows[key][2];
						// If your id is matched to item 0 (see comment above) then the name and dkp in the same row (array) are also taken, to be displayed. 
						message.channel.send(`${gameName}\nYou have : ${dkp} dkp`);
						idConfirmed = true;
						break;
					}
				}
				if (idConfirmed == false) {
					// If id isnt found then you didnt exist on the spreadsheet and whoever has access to the spreadsheet need to add your correct ID to column A. 
					message.channel.send(`Hello ${message.author.username}\nWe need to add you to the spreadsheet.\nPlease speak to an officer and send your id.`);
					console.log(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
					// Both the person typing ?dkp and the console the bot is run from can see the ID so the spreadsheet can be adjusted. 
				}
			}
			else {
				console.log('No data found.');
			}
		});
	}
});

client.login(btoken);
