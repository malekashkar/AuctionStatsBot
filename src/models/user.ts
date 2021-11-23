import { DocumentType, getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import { parseNbtData } from "../utils";

export class Item {
    @prop()
    name: string;

    @prop()
    uuid: string;

    @prop()
    timestamp: number;

    @prop()
    buyPrice: number;

    @prop()
    sellPrice: number;

    constructor(name: string, uuid: string, timestamp: number, buyPrice: number = 0, sellPrice: number = 0) {
      this.name = name;
      this.uuid = uuid;
      this.timestamp = timestamp;
      this.buyPrice = buyPrice;
      this.sellPrice = sellPrice;
    }
}

export default class DbUser {
  @prop({ required: true })
  discordId: string;

  @prop({ required: true})
  discordTag: string;

  @prop({ required: true })
  playerName: string;

  @prop({ required: true })
  uuid: string;

  @prop({ default: [] })
  inventory: Item[];

  constructor(discordId: string, discordTag: string, playerName: string, uuid: string) {
    this.discordId = discordId;
    this.discordTag = discordTag;
    this.playerName = playerName;
    this.uuid = uuid;
  }
}

export const UserModel = getModelForClass(DbUser, {
  schemaOptions: { collection: "users" },
});