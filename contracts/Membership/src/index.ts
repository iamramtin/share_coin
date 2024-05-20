import { NearBindgen, UnorderedMap, call, view, near } from "near-sdk-js";

// @NearBindgen decorator allows this code to compile to WebAssembly
@NearBindgen({})
class MembershipContract {
  members: UnorderedMap<string>;
  
  constructor() {
    this.members = new UnorderedMap('members-map');
  }

  @call({})
  add_member({ id }: { id: string }): void {
    if(!this.member_exists({ id })) this.members.set(id, "false");
    else near.log("Member already exists")
  }

  @call({})
  register_member({ id }: { id: string }): void {
    if(this.member_exists({ id })) this.members.set(id, "true");
    else near.log("Member doesn't exist")
  }

  @call({})
  unregister_member({ id }: { id: string }): void {
    if(this.member_exists({ id })) this.members.set(id, "false");
    else near.log("Member doesn't exist")
  }

  @call({})
  remove_member({ id }: { id: string }): void {
    if(this.member_exists({ id })) this.members.remove(id);
    else near.log("Member doesn't exist")
  }

  @view({})
  all_members() {
    return this.members.toArray();
  }

  @view({})
  member_exists({ id }: { id: string }) {
    return this.members.get(id) != null;
  }

  @view({})
  is_registered({ id }: { id: string }) {
    if(this.member_exists({ id })) {
      if(this.members.get(id) === "true") return true
      else return false;
    }
    else near.log("Member doesn't exist")
  }

  @view({})
  size() {
    return this.members.length;
  }
}
