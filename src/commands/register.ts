import { CommandInteraction } from "discord.js";
import Command from "."
import DbUser, { UserModel } from "../models/user";
import { getHypixelProfile, getMojangProfile } from "../utils/api";
import embeds from "../utils/embeds";

export default class RegisterCommand extends Command {
    name = "register";
    description = "Register yourself with the discord bot!";

    options = [
        {
          "type": 3,
          "name": "username",
          "description": "Your Minecracft username",
          "required": true
        }
    ];

    async execute(interaction: CommandInteraction) {
        const username = interaction.options.getString("username");
        const mojang = await getMojangProfile(username);
        if(mojang) {
            const hypixel = await getHypixelProfile(mojang.id);
            const hypixelDiscord = hypixel.player.socialMedia.links.DISCORD;
            if(hypixel.success && hypixelDiscord) {
                if(hypixelDiscord == interaction.user.tag) {
                    const profile = await UserModel.findOne({ discordTag: hypixelDiscord });
                    if(hypixelDiscord == interaction.user.tag) {
                        if(profile) {
                            if(profile.discordTag != hypixelDiscord) {
                                await profile.deleteOne();
                            } else {
                                await interaction.reply({
                                    embeds: [
                                        embeds.error(
                                            "Looks like you are already registered!"
                                        )
                                    ],
                                    ephemeral: true
                                });
                                return;
                            }
                        }

                        await UserModel.create(
                            new DbUser(
                                interaction.user.id,
                                hypixelDiscord,
                                mojang.name,
                                mojang.id
                            )
                        );
                        await interaction.reply({
                            embeds: [
                                embeds.normal(
                                    `Registered To ${this.bot.projectName}`,
                                    `You have been registered to the discord bot with the username **${mojang.name}**\n`
                                    + "Please make sure your DM's are open in order to receive your auction notifications."
                                )    
                            ],
                            ephemeral: true
                        }); 
                    }
                } else {
                    await interaction.reply({
                        embeds: [
                            embeds.error(`The Hypixel player **${mojang.name}** is not linked to your discord tag, **${interaction.user.tag}**.`)    
                        ],
                        ephemeral: true
                    }); 
                }
            } else {
                await interaction.reply({
                    embeds: [
                        embeds.error(`There is no discord tag linked to the Hypixel player **${mojang.name}**.`)    
                    ],
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                embeds: [
                    embeds.error(`The username **${username}** doesn't seem to be a valid Minecraft player name.`)    
                ],
                ephemeral: true
            });
        }
    }
}