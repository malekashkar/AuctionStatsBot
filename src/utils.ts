import fetch from "node-fetch";
import { parse } from "prismarine-nbt"
import { EndedAuctionsResponse } from "./types/hypixel";

const API_KEY = "c6e16f20-fe98-4a05-992d-ce63341696e7";

export const formatNum = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export async function getEndedAuctions() {
    const response = await fetch("https://api.hypixel.net/skyblock/auctions_ended");
    return await response.json() as EndedAuctionsResponse;
}

export async function getPersonalAuctions(uuid: string) {
    const response = await fetch(
        `https://api.hypixel.net/skyblock/auction?player=${uuid}`,
        { headers: { "API-Key": API_KEY } }
        );
    return await response.json();
}

export async function parseNbtData(item_bytes: string) {
    const buffer = Buffer.from(item_bytes, 'base64');
    const { parsed }: any = await parse(buffer);
    return {
        uuid: parsed.value.i.value.value[0].tag.value.ExtraAttributes.value.uuid.value,
        name: parsed.value.i.value.value[0].tag.value.display.value.Name.value.replace(/§./gm, "")
    };
}

export async function sendWebhook(content: string) {
    const URL = "https://discord.com/api/webhooks/911537755568353281/g3_kg73bGe14Ie_0yMGax60KU6xSkCejnugTaqsVIBnzyj1gi0ZdADxIPFidu1PJ8gaL";
    fetch(URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
}

export async function registerAuction(
    userId: string, 
    item_bytes: string, 
    timestamp: number, 
    price: number, 
    sold: boolean
 ) {
    // Get the auction in the db with the userId

    // const nbtData = await parseNbtData(item_bytes);
    // if(sold) {
    //     const auction = inventory.find(ah => ah.uuid == nbtData.uuid);
    //     if(auction) {
    //         const itemFees = (price * 0.02) + 1200;
    //         const profit = price - itemFees - auction.price;
    //         const grossProfit = price - itemFees;

    //         data.profit += profit;
    //         data.grossProfit += grossProfit;
    //         inventory = inventory.filter(ah => ah.uuid !== nbtData.uuid);

    //         sendWebhook(
    //             `Your **${auction.name}** sold for **${formatNum(price)} coins** and made **${formatNum(profit)} coins** in profit.\n`
    //             + `You currently have **${formatNum(data.profit)} coins** in total profit and **${formatNum(data.grossProfit)} coins** in gross profit.`
    //         );
    //     }
    // } else {
    //     inventory.push({
    //         name: nbtData.name,
    //         uuid: nbtData.uuid,
    //         timestamp,
    //         price 
    //     });
    //     data.moneySpent += price;

    //     sendWebhook(
    //         `You purchased a **${nbtData.name}** for **${formatNum(price)} coins**.\n`
    //         + `You spent a total of **${formatNum(data.moneySpent)} coins** on purchasing auctions.`
    //     );
    // }

    // Save the new user information into the database
}