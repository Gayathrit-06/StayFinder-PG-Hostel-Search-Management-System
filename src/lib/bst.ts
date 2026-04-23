// Binary Search Tree for rent-based range filtering
import { Hostel } from "@/types";

class BSTNode {
  data: Hostel;
  left: BSTNode | null = null;
  right: BSTNode | null = null;
  constructor(hostel: Hostel) { this.data = hostel; }
}

export class HostelBST {
  private root: BSTNode | null = null;

  insert(hostel: Hostel) {
    this.root = this._insert(this.root, hostel);
  }

  private _insert(node: BSTNode | null, hostel: Hostel): BSTNode {
    if (!node) return new BSTNode(hostel);
    if (hostel.rent < node.data.rent) node.left = this._insert(node.left, hostel);
    else node.right = this._insert(node.right, hostel);
    return node;
  }

  filterByRent(minRent: number, maxRent: number): Hostel[] {
    const result: Hostel[] = [];
    this._rangeSearch(this.root, minRent, maxRent, result);
    return result;
  }

  private _rangeSearch(node: BSTNode | null, min: number, max: number, result: Hostel[]) {
    if (!node) return;
    if (node.data.rent > min) this._rangeSearch(node.left, min, max, result);
    if (node.data.rent >= min && node.data.rent <= max) result.push(node.data);
    if (node.data.rent < max) this._rangeSearch(node.right, min, max, result);
  }

  // Rebuild tree from array
  static fromArray(hostels: Hostel[]): HostelBST {
    const bst = new HostelBST();
    hostels.forEach(h => bst.insert(h));
    return bst;
  }
}
