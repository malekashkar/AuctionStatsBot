import Bot from "../index";
import { CommandInteraction } from "discord.js";

export default abstract class Command {
  options: any[] = [];
  disabled = false;

  bot: Bot;

  abstract name: string;
  abstract description: string;
  

  constructor(bot: Bot) {
      this.bot = bot;
  }

  abstract execute(interaction: CommandInteraction): Promise<void>;
}