import Bot from "../index";
import { CommandInteraction } from "discord.js";

export default abstract class Command {
  disabled = false;
  usage = "";

  bot: Bot;

  abstract name: string;
  abstract description: string;
  abstract options: any[];

  constructor(bot: Bot) {
      this.bot = bot;
  }

  abstract execute(interaction: CommandInteraction): Promise<void>;
}