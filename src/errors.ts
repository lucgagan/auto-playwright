export abstract class AutoPlaywrightError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnimplementedError extends AutoPlaywrightError {
  public constructor(message?: string) {
    super(message);
  }
}
