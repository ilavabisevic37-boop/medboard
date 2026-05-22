/**
 * Base class for all domain Entities. Identity-based equality.
 */
export abstract class Entity<TId extends string | number> {
  protected readonly _id: TId;

  protected constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  equals(other?: Entity<TId>): boolean {
    if (other == null) return false;
    if (this === other) return true;
    return this._id === other._id;
  }
}
