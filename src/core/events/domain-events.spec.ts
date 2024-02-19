import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: AggregateRoot<any>;

  constructor(aggregate: AggregateRoot<any>) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create(id?: UniqueEntityId) {
    const aggregate = new CustomAggregate(null, id);
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe("DomainEvents", () => {
  it("Should be able to dispacth and to listen events", () => {
    const callbackSpy = vi.fn();
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();
    expect(aggregate.domainEvents).toHaveLength(1);
    expect(aggregate.domainEvents[0]).toBeInstanceOf(CustomAggregateCreated);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
