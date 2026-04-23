// AVL Tree for balanced, sorted hostel retrieval by rent
import { Hostel } from "@/types";

class AVLNode {
  data: Hostel;
  left: AVLNode | null = null;
  right: AVLNode | null = null;
  height = 1;
  constructor(hostel: Hostel) { this.data = hostel; }
}

export class HostelAVL {
  private root: AVLNode | null = null;

  private getHeight(node: AVLNode | null): number { return node ? node.height : 0; }

  private getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateHeight(node: AVLNode) {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  private rightRotate(y: AVLNode): AVLNode {
    const x = y.left!;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  private leftRotate(x: AVLNode): AVLNode {
    const y = x.right!;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  insert(hostel: Hostel) {
    this.root = this._insert(this.root, hostel);
  }

  private _insert(node: AVLNode | null, hostel: Hostel): AVLNode {
    if (!node) return new AVLNode(hostel);

    if (hostel.rent < node.data.rent) node.left = this._insert(node.left, hostel);
    else node.right = this._insert(node.right, hostel);

    this.updateHeight(node);
    const balance = this.getBalance(node);

    // Left Left
    if (balance > 1 && hostel.rent < node.left!.data.rent) return this.rightRotate(node);
    // Right Right
    if (balance < -1 && hostel.rent > node.right!.data.rent) return this.leftRotate(node);
    // Left Right
    if (balance > 1 && hostel.rent > node.left!.data.rent) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    // Right Left
    if (balance < -1 && hostel.rent < node.right!.data.rent) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  // In-order traversal returns hostels sorted by rent (ascending)
  getSortedByRent(): Hostel[] {
    const result: Hostel[] = [];
    this._inOrder(this.root, result);
    return result;
  }

  private _inOrder(node: AVLNode | null, result: Hostel[]) {
    if (!node) return;
    this._inOrder(node.left, result);
    result.push(node.data);
    this._inOrder(node.right, result);
  }

  static fromArray(hostels: Hostel[]): HostelAVL {
    const avl = new HostelAVL();
    hostels.forEach(h => avl.insert(h));
    return avl;
  }
}
