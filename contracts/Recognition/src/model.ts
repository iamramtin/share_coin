import { bytes } from "near-sdk-js";

export const STORAGE_COST: bigint = BigInt("1000000000000000000000");
export const NO_ARGS: string = bytes(JSON.stringify({}));
export const NO_DEPOSIT: bigint = BigInt(0);
export const ONE_TGAS: bigint = BigInt("10000000000000");
export const FIVE_TGAS = BigInt("50000000000000");
export const MAX_TGAS = BigInt("300000000000000");

export class Recognition {
  receiver_id: string;
  total_amount: string;
  message: string;
}