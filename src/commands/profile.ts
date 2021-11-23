import { CommandInteraction } from "discord.js";
import Command from ".";
import { Item, UserModel } from "../models/user";
import embeds from "../utils/embeds";

export default class ProfileCommand extends Command {
    name = "profile";
    description = "Check your auction stats.";

    async execute(interaction: CommandInteraction) {
      const profile = await UserModel.findOne({ discordId: interaction.user.id });
      if(profile) {
        if(profile.inventory.length > 0) {
          const stats = this.auctionStats(profile.inventory);
          await interaction.reply({
            embeds: [
              embeds.normal(
                "Auction Stats",
                "Below are all the available statistics on your auctions."
              )
              .addField(
                "Day Statistics",
                `Items Purchased: ${stats.day.itemsPurchased}\n` +
                `Items Sold: ${stats.day.itemsSold}\n` +
                `Profit: ${stats.day.profit}\n` +
                `Gross Profit: ${stats.day.grossProfit}\n` +
                `Money Spent: ${stats.day.moneySpent}\n`
              )
              .addField(
                "Week Statistics",
                `Items Purchased: ${stats.week.itemsPurchased}\n` +
                `Items Sold: ${stats.week.itemsSold}\n` +
                `Profit: ${stats.week.profit}\n` +
                `Gross Profit: ${stats.week.grossProfit}\n` +
                `Money Spent: ${stats.week.moneySpent}\n`
              )
              .addField(
                "Total Statistics",
                `Items Purchased: ${stats.total.itemsPurchased}\n` +
                `Items Sold: ${stats.total.itemsSold}\n` +
                `Profit: ${stats.total.profit}\n` +
                `Gross Profit: ${stats.total.grossProfit}\n` +
                `Money Spent: ${stats.total.moneySpent}\n`
              )
            ],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [
              embeds.error(
                "Please purchase or sell an auction before using this command."
              )
            ],
            ephemeral: true
          });
        }
      } else {
        await interaction.reply({
          embeds: [
            embeds.error(
              "Please use the \`/register\` command before using the **profile** command."
            )
          ],
          ephemeral: true
        });
      }
    }

    private auctionStats(inventory: Item[]) {
      const dayInventory = inventory.filter(item => Date.now() - item.timestamp < 24 * 60 * 60 * 1000);
      const weekInventory = inventory.filter(item => Date.now() - item.timestamp < 7 * 24 * 60 * 60 * 1000);
      return {
        day: {
          itemsPurchased: dayInventory.filter(item => item.buyPrice).length,
          itemsSold: dayInventory.filter(item => item.sellPrice).length,
          profit: dayInventory.reduce((a, b) => a + (b.buyPrice - b.sellPrice), 0),
          moneySpent: dayInventory.reduce((a, b) => a + b.buyPrice, 0),
          grossProfit: dayInventory.reduce((a, b) => a + b.sellPrice, 0)
        },
        week: {
          itemsPurchased: weekInventory.filter(item => item.buyPrice).length,
          itemsSold: weekInventory.filter(item => item.sellPrice).length,
          profit: weekInventory.reduce((a, b) => a + (b.buyPrice - b.sellPrice), 0),
          moneySpent: weekInventory.reduce((a, b) => a + b.buyPrice, 0),
          grossProfit: weekInventory.reduce((a, b) => a + b.sellPrice, 0)
        },
        total: {
          itemsPurchased: inventory.filter(item => item.buyPrice).length,
          itemsSold: inventory.filter(item => item.sellPrice).length,
          profit: inventory.reduce((a, b) => a + (b.buyPrice - b.sellPrice), 0),
          moneySpent: inventory.reduce((a, b) => a + b.buyPrice, 0),
          grossProfit: inventory.reduce((a, b) => a + b.sellPrice, 0)
        }
      }
    }
}