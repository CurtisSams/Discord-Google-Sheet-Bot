# Discord-Google-Sheet-Bot
This was designed to read peoples DKP(score) from a google speadsheet.

https://discordjs.guide/
https://developers.google.com/sheets/api/quickstart/nodejs

This was mostly an adaptation of the discord js tutorial bot, and then throwing in the googlesheets access tutorial, with a few tweaks to run off an existing google api account. 
Where you will need to place your details I have shown in the code itself. 

Requirements

Discord developer portal access 

Google API access (Google API does charge for its calls, please look into it before signing up)

Node.js (In discord guide)

Discord.js (In discord guide)

eslintrc.json


index.js is the file you run (will need edits. Look for all caps in the code)


client_id.json (These two will need editing as shown in the file)



GUIDE

I recommend following the https://discordjs.guide/ the linter file is included above. (eslintrc.json).

Once you complete the Adding More Commands stage and your bot works as the guide tells you, then you should be able to replace the index.js file you created with this one. 

Next you will need to enable google sheets API
https://developers.google.com/sheets/api/quickstart/nodejs

As you can see the code is pretty much the same from step 3 of the tutorial there. The only difference is 
fs.readFile('credentials.json', (err, content) => {
becomes 
fs.readFile('client_id.json', (err, content) => Which is included in this project

Make a google sheets file

In the discord bot tutorial you learn your unique id, make note of it and add it to A1 of a google spreadsheet you create.
Add anything to B1 and anything to C1

If you run it and the bot asks you to talk to an officer it means your unique id is not in the A column. Defaulted to read upto 100 lines down. 


Hope it works for you, keep an eye out for CAPS LOCK in the files as it means you need to put a unique string there. 





