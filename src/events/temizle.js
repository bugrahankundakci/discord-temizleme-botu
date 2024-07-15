const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isSelectMenu() && interaction.customId === 'cleanOptions') {
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case 'roleDelete':
                    await interaction.reply('Roller temizleniyor...');
                    interaction.guild.roles.cache.forEach(async (role) => {
                        try {
                            await role.delete();
                            console.log(`Silinen Rol: ${role.name}`);
                            await interaction.member.send({ content: `Silinen rol: **${role.name}**` });
                        } catch (error) {
                            console.error(`Rolü silinirken hata oluştu: ${role.name}: ${error.message}`);
                        }
                    });
                    break;

                case 'channelDelete':
                    await interaction.reply('Kanallar temizleniyor...');
                    interaction.guild.channels.cache.forEach(async (channel) => {
                        try {
                            await channel.delete();
                            console.log(`Silinen Kanal: ${channel.name}`);
                            await interaction.member.send({ content: `**${channel.name}** kanalı silindi!`, ephemeral: true });
                        } catch (error) {
                            console.error(`Kanal silinirken hata oluştu: ${channel.name}: ${error.message}`);
                        }
                    });
                    break;

                case 'serverDelete':
                    await interaction.member.send('Sunucu profili siliniyor...');
                    try {
                        await interaction.guild.setIcon(null);
                        console.log(`Sunucu profili silindi: ${interaction.guild.name}`);
                        await interaction.member.send({ content: `**${interaction.guild.name}** sunucusu profili silindi!`, ephemeral: true });
                    } catch (error) {
                        console.error(`Sunucu silinirken hata oluştu: ${error.message}`);
                    }
                    break;

                case 'nameChange':
                    const nameChangeModal = new ModalBuilder()
                        .setCustomId('nameChangeModal')
                        .setTitle('Yeni İsim Girişi');

                    const newNameInput = new TextInputBuilder()
                        .setCustomId('newName')
                        .setLabel('Yeni isim ne olacak?')
                        .setPlaceholder('Yeni ismi girin')
                        .setStyle(TextInputStyle.Short);

                    const actionRow = new ActionRowBuilder()
                        .addComponents(newNameInput);

                    nameChangeModal.addComponents(actionRow);
                    await interaction.showModal(nameChangeModal);
                    break;

                case 'iconChange':
                    const iconChangeModal = new ModalBuilder()
                        .setCustomId('iconChange')
                        .setTitle('Profil Resmi Değiştirme');

                    const iconInput = new TextInputBuilder()
                        .setCustomId('militaninserverppdeisikligi')
                        .setLabel('Sunucunun PP\'si ne olacak?')
                        .setPlaceholder('Sunucu PP linki girin')
                        .setStyle(TextInputStyle.Short);

                    const iconActionRow = new ActionRowBuilder()
                        .addComponents(iconInput);

                    iconChangeModal.addComponents(iconActionRow);
                    await interaction.showModal(iconChangeModal);
                    break;

                case 'kickMembers':
                    const members = interaction.guild.members.cache;
                    const kickedMembers = [];
                    const notKickedMembers = [];

                    for (const member of members.values()) {
                        try {
                            await member.kick(`${interaction.member.displayName} tarafından kicklendi`);
                            kickedMembers.push(member.user.tag);
                        } catch (error) {
                            if (error.code === 50013) {
                                notKickedMembers.push(member.user.tag);
                            } else {
                                console.error(`Error kicking ${member.user.tag}:`, error);
                            }
                        }
                    }

                    let replyMessage = 'Kick işlemi tamamlandı.\n';
                    if (kickedMembers.length) {
                        replyMessage += `Kicklenen üyeler: ${kickedMembers.join(', ')}\n`;
                    }
                    if (notKickedMembers.length) {
                        replyMessage += `Yetkim olmadığı için bazı kişileri kickleyemedim: ${notKickedMembers.join(', ')}`;
                    }

                    await interaction.reply({ content: replyMessage, ephemeral: true });
                    break;

                case 'changeNames':
                    const changeNamesModal = new ModalBuilder()
                        .setCustomId('changeNamesModal')
                        .setTitle('Yeni İsim Girişi');

                    const changeNameInput = new TextInputBuilder()
                        .setCustomId('changeName')
                        .setLabel('Yeni isim ne olacak?')
                        .setPlaceholder('Yeni ismi girin')
                        .setStyle(TextInputStyle.Short);

                    const changeActionRow = new ActionRowBuilder()
                        .addComponents(changeNameInput);

                    changeNamesModal.addComponents(changeActionRow);
                    await interaction.showModal(changeNamesModal);
                    break;

                default:
                    await interaction.reply('Geçersiz seçenek!');
                    break;
            }
        } else if (interaction.type === InteractionType.ModalSubmit) {
            if (interaction.customId === 'nameChangeModal') {
                const newServerName = interaction.fields.getTextInputValue('newName');

                try {
                    await interaction.guild.setName(newServerName);
                    await interaction.member.send(`Başarılı bir şekilde sunucunun adı ${newServerName} olarak değiştirildi!`);
                    await interaction.member.send({ content: `${interaction.guild.id} id'li sunucunun adı ${newServerName} olarak değiştirildi!` });
                } catch (error) {
                    console.error(`Sunucu adı değiştirilirken hata oluştu: ${error.message}`);
                    await interaction.reply('Sunucu adı değiştirilirken hata oluştu.');
                }
            } else if (interaction.customId === 'iconChange') {
                const newIconURL = interaction.fields.getTextInputValue('militaninserverppdeisikligi');

                try {
                    await interaction.guild.setIcon(newIconURL);
                    await interaction.reply(`Başarılı bir şekilde sunucunun profil resmi değiştirildi!`);
                    await interaction.member.send({ content: `${interaction.guild.id} id'li sunucunun profil resmi değiştirildi!` });
                } catch (error) {
                    console.error(`Sunucu profil resmi değiştirilirken hata oluştu: ${error.message}`);
                    await interaction.reply('Sunucu profil resmi değiştirilirken hata oluştu.');
                }
            } else if (interaction.customId === 'changeNamesModal') {
                const newName = interaction.fields.getTextInputValue('changeName');
                const members = await interaction.guild.members.fetch();
                const successfulChanges = [];
                const failedChanges = [];

                for (const member of members.values()) {
                    try {
                        await member.setNickname(newName);
                        successfulChanges.push(member.user.tag);
                    } catch (error) {
                        failedChanges.push(member.user.tag);
                    }
                }

                let replyMessage = `İsim değiştirme işlemi tamamlandı.\n`;

                if (successfulChanges.length) {
                    replyMessage += `İsmi değiştirilen üyeler: ${successfulChanges.join(', ')}\n`;
                }
                if (failedChanges.length) {
                    replyMessage += `Yetkim olmadığı için bazı üyelerin ismini değiştiremedim: ${failedChanges.join(', ')}`;
                }

                await interaction.member.send({ content: `${replyMessage}.`, ephemeral: true });
            }
        }
    }
};
