import {ObjectId} from "mongoose";

export default interface loggedInInterface {
  _id: ObjectId,
  email: string,
  username: string
}
