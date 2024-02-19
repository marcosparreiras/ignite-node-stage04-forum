import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashCompare {
  private hashed: string = "-hashed";

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat(this.hashed) === hash;
  }

  async hash(plain: string): Promise<string> {
    return plain.concat(this.hashed);
  }
}
