export abstract class IMockupRepository<T> {
  abstract exportImage(url: string): Promise<T>;
}
