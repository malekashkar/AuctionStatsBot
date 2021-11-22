import { CommandInteraction, Interaction } from "discord.js";
import Command from "."

export default class RegisterCommand extends Command {
    name = "register";
    description = "Register yourself with the discord bot!";

    options = [
        {
          "type": 3,
          "name": "name",
          "description": "Your Minecracft username",
          "required": true
        }
    ];

    async execute(interaction: CommandInteraction) {
        
        // Ask for their discord id
        // Ask for their ingame ign
        await interaction.reply('Registered!')
    }
}