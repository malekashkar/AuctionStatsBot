import { MessageEmbed } from "discord.js";

function empty() {
  return new MessageEmbed();
}

function error(text: string, title = "Error") {
  const embed = new MessageEmbed()
    .setColor(`#ff665b`)
    .setTitle(title)
    .setDescription(text)
    .setFooter(`Oh wait, is this a bug? Let us know in our support server.`)
    .setTimestamp();

  return embed;
}

function normal(title: string, text: string) {
  return new MessageEmbed()
    .setColor(`#f0e365`)
    .setTitle(title)
    .setDescription(text)
    .setTimestamp();
}

export default { error, normal, empty };