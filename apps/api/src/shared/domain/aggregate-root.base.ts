import { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';

/**
 * Aggregate Root — the only entity through which a bounded context allows mutation
 * of the aggregate. Collects domain events to be dispatched after persistence.
 */
export abstract class AggregateRoot<TId extends string | number> extends Entity<TId> {
  private readonly _events: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }

  pullEvents(): DomainEvent[] {
    const events = [...this._events];
    this._events.length = 0;
    return events;
  }
}
