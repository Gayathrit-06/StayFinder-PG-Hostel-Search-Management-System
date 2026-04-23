// HashMap for O(1) hostel lookups by ID
import { Hostel } from "@/types";

export class HostelHashMap {
  private table: Map<string, Hostel> = new Map();

  insert(hostel: Hostel) {
    this.table.set(hostel.id, hostel);
  }

  get(id: string): Hostel | undefined {
    return this.table.get(id);
  }

  exists(id: string): boolean {
    return this.table.has(id);
  }

  remove(id: string) {
    this.table.delete(id);
  }

  update(id: string, data: Partial<Hostel>) {
    const existing = this.table.get(id);
    if (existing) this.table.set(id, { ...existing, ...data });
  }

  getAll(): Hostel[] {
    return Array.from(this.table.values());
  }

  static fromArray(hostels: Hostel[]): HostelHashMap {
    const map = new HostelHashMap();
    hostels.forEach(h => map.insert(h));
    return map;
  }
}
