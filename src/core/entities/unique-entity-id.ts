import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private value: string;

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  public equals(id: UniqueEntityId) {
    return id.toValue() === this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}
