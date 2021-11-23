import { parse } from "prismarine-nbt"

export const formatNum = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export async function parseNbtData(item_bytes: string) {
    const buffer = Buffer.from(item_bytes, 'base64');
    const { parsed }: any = await parse(buffer);
    return {
        uuid: parsed.value.i.value.value[0].tag.value.ExtraAttributes.value.uuid.value,
        name: parsed.value.i.value.value[0].tag.value.display.value.Name.value.replace(/§./gm, "")
    };
}