const { ActivityType, Events } = require("discord.js");
const minik = require('../../minik.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} aktif!`);
        setPresence(client);
    },
};


function setPresence(client) {
    client.user.setPresence({
        activities: [
            {
                name: minik.bot.oynuyor,
                type: ActivityType.Competing,
            },
        ],
        status: minik.bot.durum,
    });
}
