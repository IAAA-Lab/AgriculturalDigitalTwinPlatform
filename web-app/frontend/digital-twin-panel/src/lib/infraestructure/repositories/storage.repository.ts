import type { IInternalStorageRepository } from "src/lib/core/ports/Repository";

class LocalStorageRepository implements IInternalStorageRepository {
  constructor(private readonly storage: Storage) {}

  get(key: string): string {
    return this.storage.getItem(key);
  }

  set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}

export default LocalStorageRepository;
