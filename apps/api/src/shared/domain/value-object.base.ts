/**
 * Base class for all Value Objects. Structural equality, immutable.
 */
export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected readonly props: TProps;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  equals(other?: ValueObject<TProps>): boolean {
    if (other == null) return false;
    if (this === other) return true;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
