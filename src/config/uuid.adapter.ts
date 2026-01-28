import { v4 as uuuidv4 }from 'uuid'

export class Uuuid {
  static v4 = () => uuuidv4();
}