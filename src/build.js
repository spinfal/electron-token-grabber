const editJsonFile = require("edit-json-file");
const file = editJsonFile(__dirname + '/config.json');

const args = process.argv.slice(2);
if (args.length == 0) return console.log("No input provided.");
if (!/^https?:\/\/(www\.)?[discord.com/api/webhooks]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/.test(args[0])) return console.log("Invalid webhook URL.");
file.set("webhook_url", args[0]);
file.save();
console.log("Webhook URL set.");