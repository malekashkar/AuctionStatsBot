import * as dotenv from "dotenv";
import fetch from "node-fetch";

import { EndedAuctionsResponse, PlayerResponse } from "../types/hypixel";
import { MojangProfileResponse } from "../types/mojang";

dotenv.config();

export async function getEndedAuctions() {
    const response = await fetch("https://api.hypixel.net/skyblock/auctions_ended");
    return await response.json() as EndedAuctionsResponse;
}

export async function getPersonalAuctions(uuid: string) {
    const response = await fetch(
        `https://api.hypixel.net/skyblock/auction?player=${uuid}`,
        { headers: { "API-Key": process.env.HYPIXEL_APIKEY } }
        );
    return await response.json();
}

export async function getMojangProfile(username: string) {
    const response = await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${username}`
    );
    return await response.json() as MojangProfileResponse;
}

export async function getHypixelProfile(uuid: string) {
    const response = await fetch(
        `https://api.hypixel.net/player?uuid=${uuid}`,
        { headers: { "API-Key": process.env.HYPIXEL_APIKEY } }
    );
    return await response.json() as PlayerResponse;
}