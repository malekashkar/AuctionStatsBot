import * as dotenv from 'dotenv';
import path from "path";
import fs from "fs";

import Command from "./commands/index";

import { Client, ClientOptions, Interaction, Collection, Intents } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { getEndedAuctions } from "./utils";
import { UserModel } from "./models/user";

import "./database";

dotenv.config();

export default class Bot extends Client {
    token = process.env.TOKEN;
    mainGuildId = "863476006122815498";

    commands: Collection<String, Command> = new Collection();
    restAPI = new REST({ version: '9' }).setToken(this.token);
    
    hypixelApiLastUpdated = 0;
    checker: NodeJS.Timer;

    constructor(options?: ClientOptions) {
        super({
            ...options,
            intents: [Intents.FLAGS.GUILDS]
          });

        this.login(this.token);
        this.once("ready", (c) => this.onReady(c));
        this.on("interactionCreate", async(interaction) => {await this.onInteraction(interaction)});
    }

    async onReady(client: Client) {
        await this.loadCommands();
        console.log(`[BOT] Logged in successfuly to ${client.user.tag}!`);
    }

    async onInteraction(interaction: Interaction) {
        if(!interaction.isCommand()) return;
        
        const command = this.commands.get(interaction.commandName);
        if (!command) return;
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    async startChecker() {
        this.checker = setInterval(async() => {
            const response = await getEndedAuctions();
            const userIds = await UserModel.aggregate();

            if(response.lastUpdated !== this.hypixelApiLastUpdated) {
                // Push something into the database


                // for(const endedAuction of response.auctions) {
                //     for(const userId of userIds) {
                //         if(endedAuction.seller == userId) {
                //             await registerAuction(
                //                 userId,
                //                 endedAuction.item_bytes,
                //                 endedAuction.timestamp,
                //                 endedAuction.price,
                //                 true
                //             );
                //         } else if(endedAuction.buyer == userId) {
                //             await registerAuction(
                //                 userId,
                //                 endedAuction.item_bytes,
                //                 endedAuction.timestamp,
                //                 endedAuction.price,
                //                 false
                //             );
                //         }
                //     }
                // }
                this.hypixelApiLastUpdated = response.lastUpdated;
            }
        }, 1000);
    }

    private async loadCommands(commandsDir = path.join(__dirname, "commands")) {
        if (fs.statSync(commandsDir).isDirectory()) {
            for (const commandFile of fs.readdirSync(commandsDir)) {
                const commandPath = path.join(commandsDir, commandFile);
                if (fs.statSync(commandPath).isFile()) {
                    if (path.parse(commandPath).name === "index") continue;
                        if (/^.*\.(js|ts|jsx|tsx)$/i.test(commandFile)) {
                            const tmpCommand = require(commandPath);
                            const command =
                                typeof tmpCommand !== "function" &&
                                typeof tmpCommand.default === "function"
                                ? tmpCommand.default
                                : typeof tmpCommand === "function"
                                ? tmpCommand
                                : null;
                            if (command) {
                                try {
                                    const commandObj: Command = new command(this);
                                    if (commandObj && commandObj.name) {
                                        if (!this.commands) this.commands = new Collection();
                                        if (this.commands.has(commandObj.name)) {
                                            throw `Duplicate command name ${commandObj.name}`;
                                        } else {
                                            this.commands.set(commandObj.name.toLowerCase(), commandObj);
                                        }
                                    }
                                } catch (ignored) {}
                            }
                    }
                } else {
                    this.loadCommands(commandPath);
                }
            }
        }

        // Delete

        await this.restAPI.put(
            Routes.applicationGuildCommands(this.user.id, this.mainGuildId),
            { 
               body: this.commands.map(cmd => { return { name: cmd.name, description: cmd.description, options: cmd.options }})
            },
        );
      }
}

new Bot();