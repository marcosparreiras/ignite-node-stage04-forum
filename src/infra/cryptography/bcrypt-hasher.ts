import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcryptjs";

@Injectable()
export class BcryptHasherService implements HashCompare, HashGenerator {
  async compare(plain: string, hash: string): Promise<boolean> {
    const validate = await compare(plain, hash);
    return validate;
  }

  async hash(plain: string): Promise<string> {
    const hashed = await hash(plain, 8);
    return hashed;
  }
}
