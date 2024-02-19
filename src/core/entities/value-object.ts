export abstract class ValueObject<Props> {
  protected props: Props;

  public equals(valueObject: ValueObject<unknown>): boolean {
    if (
      valueObject === null ||
      valueObject === undefined ||
      valueObject.props === undefined
    ) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }

  protected constructor(props: Props) {
    this.props = props;
  }
}
