import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export const bcrytpAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync();
    return hashSync(password, salt);
  },
  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed)
  },
}

