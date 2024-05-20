import { NearBindgen, NearPromise, UnorderedMap, call, view, near, bytes, initialize, Vector } from "near-sdk-js";
import { AccountId } from 'near-sdk-js/lib/types';

import { Recognition, STORAGE_COST, NO_DEPOSIT, NO_ARGS, ONE_TGAS, FIVE_TGAS } from './model';

const MEMBERSHIP_CONTRACT_ID: AccountId = "membership.synthesiscoin.testnet";
const INIT_TOKENS = 10;

// npm run build && near dev-deploy build/contract.wasm --initFunction init --initArgs '{}' --initGas=300000000000000 

// @NearBindgen decorator allows this code to compile to WebAssembly
@NearBindgen({})
class RecognitionContract {
  recognitions = new UnorderedMap<Recognition[]>('map-uid-1');
  tokens = new UnorderedMap<number>('map-uid-2');
  members = new UnorderedMap<string>('map-uid-3');
  
  @initialize({ privateFunction: true })
  init() {
    const promise = NearPromise.new(MEMBERSHIP_CONTRACT_ID).functionCall("all_members", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
    .then(NearPromise.new(near.currentAccountId()).functionCall("init_callback", NO_ARGS, NO_DEPOSIT, FIVE_TGAS));

    return promise.asReturn();
  }

  @call({privateFunction: true})
  init_callback() {
    let { result, success } = promiseResult();
    
    if (success) {
      const dataObj = JSON.parse(result);
      for (let i = 0; i < dataObj.length; i++) {
        const id = dataObj[i][0];
        const registered = dataObj[i][1];

        this.members.set(id, registered);
        this.tokens.set(id, INIT_TOKENS);
      }
    } else {
      return "Promise failed...";
    }
  }

  @call({})
  recognize({ receiver_id, recognition_amount, message = "" }: { receiver_id: string, recognition_amount: number, message: string }) {
    // Get who is calling the method and how much $NEAR they attached
    let sender_id = near.predecessorAccountId();
    let sender_tokens = this.tokens.get(sender_id);
    let receiver_tokens = this.tokens.get(receiver_id);

    // if(!this.query_member_registered({ member_id: near.predecessorAccountId() })) return "Sender not registered";
    // if(!this.query_member_registered({ member_id: receiver_id })) return "Receiver not registered";
    if(recognition_amount > sender_tokens) return `Not enough tokens: you only have ${sender_tokens} token(s)...`
    
    let accountRecognitions = this.recognitions.get(sender_id);
    if(accountRecognitions === null) {
      accountRecognitions = [{ receiver_id: receiver_id, total_amount: recognition_amount.toString(), message: message }];
    } else {
      accountRecognitions.push({ receiver_id: receiver_id, total_amount: recognition_amount.toString(), message: message });
    }

    this.recognitions.set(sender_id, accountRecognitions);
    this.tokens.set(sender_id, sender_tokens - recognition_amount);
    this.tokens.set(receiver_id, receiver_tokens + recognition_amount);
  }

  @view({})
  all_recognitions({ from_index = 0, limit = 50 }: { from_index: number, limit: number }): Recognition[] {
    let rec: Recognition[] = [];
    let end = Math.min(limit, this.recognitions.length);

    for (let i = from_index; i < end; i++) {
      const account_id: string = this.recognitions.keys.get(i) as string;
      rec = rec.concat(this.account_recognitions({ account_id }));
    }

    return rec;
  }

  @call({})
  set_account_tokens({ account_id, total_amount }: { account_id: string, total_amount: number }) {
    this.tokens.set(account_id, total_amount);
  }

  @view({})
  all_tokens() {
    return this.tokens.toArray();
  }

  @view({})
  all_members() {
    return this.members.toArray();
  }

  @view({})
  account_tokens({ account_id }: { account_id: string }): number {
    return this.tokens.get(account_id);
  }

  @view({})
  account_recognitions({ account_id }: { account_id: string }): Recognition[] {
    return this.recognitions.get(account_id);
  }

  @view({})
  account_recognitions_size({ account_id }: { account_id: string }): number {
    return this.recognitions.get(account_id).length;
  }
  
  // -------------------------------- \\
  // * * * CROSS-CONTRACT CALLS * * * \\
  @call({privateFunction: true})
  callback() {
    let { result, success } = promiseResult();

    if (success) return result;
    else return "Promise failed...";
  }

  @call({})
  query_all_members(): NearPromise {
    const promise = NearPromise.new(MEMBERSHIP_CONTRACT_ID).functionCall("all_members", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
    .then(NearPromise.new(near.currentAccountId()).functionCall("callback", NO_ARGS, NO_DEPOSIT, FIVE_TGAS));
    
    return promise.asReturn();
  }

  @call({})
  query_member_registered({ member_id }: {member_id: AccountId }): NearPromise {
    const args = bytes(JSON.stringify({ id: member_id }));

    let promise = NearPromise.new(MEMBERSHIP_CONTRACT_ID).functionCall("is_registered", args, NO_DEPOSIT, ONE_TGAS)
    .then(NearPromise.new(near.currentAccountId()).functionCall("callback", NO_ARGS, NO_DEPOSIT, ONE_TGAS));

    return promise.asReturn();
  }
  
  @call({})
  query_member_exists({ member_id }: {member_id: AccountId }): NearPromise {
    const args = bytes(JSON.stringify({ id: member_id }));
    
    const promise = NearPromise.new(MEMBERSHIP_CONTRACT_ID).functionCall("member_exists", args, NO_DEPOSIT, ONE_TGAS)
    .then(NearPromise.new(near.currentAccountId()).functionCall("callback", NO_ARGS, NO_DEPOSIT, ONE_TGAS));
    
    return promise.asReturn();
  }
}

function promiseResult(): {result: string, success: boolean}{
  let result: string, success: boolean;
  
  try { result = near.promiseResult(0); success = true; }
  catch { result = undefined; success = false; }
  
  return { result, success };
}