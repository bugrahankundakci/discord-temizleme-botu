const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Partials, resolveColor, Client, GatewayIntentBits,PermissionFlagsBits } = require("discord.js");
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const minik = require('./minik.json');
const eventHandlers = require('./src/handlers/eventHandlers');
const { commandMap } = require('./src/handlers/commandHandler');

const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((Militan) => GatewayIntentBits[Militan]),
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();
client.selectMenus = new Discord.Collection();
client.modals = new Discord.Collection();
eventHandlers(client);

client.on('messageCreate', async (message) => {
    if (message.content === '!temizle') {

        const militanembed = new EmbedBuilder()
            .setTitle(`Sunucu Temizleme Menüsü`)
            .setColor('ff0400')
            .setDescription(`**Sizler için hazırladığım discord sunucu temizleme botunu aşağıdaki menüden kullanabilirsiniz!** \n\n\n Sosyal medyalar \n\n [Github](https://github.com/militancc) \n [Instagram](https://instagram.com/militancc) \n [Discord](https://discord.com/users/571989790434787348)`);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('cleanOptions')
            .setPlaceholder('ne yapmak istersin çocuk adam?')
            .addOptions([
                { label: 'Rolleri Temizle', value: 'roleDelete' },
                { label: 'Kanalları Temizle', value: 'channelDelete' },
                { label: 'Sunucu Profil Silme', value: 'serverDelete' },
                { label: 'Sunucu İsim Değiştirme', value: 'nameChange' },
                { label: 'Sunucu PP Değiştirme', value: 'iconChange' },
                { label: 'Sunucudaki Üyeleri Kickle', value: 'kickMembers' },
                { label: 'Sunucudaki Üyelerin İsmini Değiştir', value: 'changeNames' },
            ]);

        const actionRow = new ActionRowBuilder()
            .addComponents(selectMenu);


        await message.channel.send({ embeds: [militanembed], components: [actionRow] });
    
    }
});





const rest = new REST({ version: '10' }).setToken(minik.bot.token);
(async () => {
    try {
        console.log('(/) komutları başlatıldı ve yenilendi!');

        await rest.put(
            Routes.applicationGuildCommands(minik.bot.botid, minik.bot.serverid),
            { body: commandMap.map(cmd => cmd.data.toJSON()) },
        );

        console.log('(/) komutları başarıyla yüklendi!');
    } catch (error) {
        console.error(error);
    }
})();


client.login(minik.bot.token).then(() => {
    console.clear();
    console.log('[Minik API] ' + client.user.username + ' Giriş Yaptım.');
    }).catch((err) => console.log(err)
    );
