const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('temizle')
        .setDescription('Sunucu temizleme menüsü gönderir.'),
    
    async execute(interaction) {
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


        await interaction.reply({ embeds: [militanembed], components: [actionRow] });
        
    }
};
