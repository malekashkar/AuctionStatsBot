import { getModelForClass, prop } from "@typegoose/typegoose";

export class UserData {
    @prop({ default: 0 })
    profit: Number;

    @prop({ default: 0 })
    grossProfit: Number;

    @prop({ default: 0 })
    moneySpent: Number;
}

export class Inventory {
    @prop()
    name: String;

    @prop()
    uuid: String;

    @prop()
    timestamp: Number;

    @prop()
    price: Number;
}

export default class DbUser {
  @prop({ required: true })
  discordId: String;

  @prop({ required: true })
  uuid: String;

  @prop({ default: [] })
  inventory: Inventory[];

  @prop({ default: UserData })
  data: UserData;

  constructor(discordId: string, uuid: string) {
    this.discordId = discordId;
    this.uuid = uuid;
  }
}

export const UserModel = getModelForClass(DbUser, {
  schemaOptions: { collection: "users" },
});