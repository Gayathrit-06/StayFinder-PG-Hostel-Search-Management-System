// Trie data structure for location autocomplete

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
  word = "";
}

export class Trie {
  private root = new TrieNode();

  insert(word: string) {
    let node = this.root;
    const lower = word.toLowerCase();
    for (const ch of lower) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
    node.word = word;
  }

  search(prefix: string): string[] {
    let node = this.root;
    const lower = prefix.toLowerCase();
    for (const ch of lower) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    const results: string[] = [];
    this._collect(node, results);
    return results;
  }

  private _collect(node: TrieNode, results: string[]) {
    if (node.isEnd) results.push(node.word);
    for (const child of node.children.values()) {
      this._collect(child, results);
    }
  }
}

// Pre-built location trie
const locationTrie = new Trie();
const LOCATIONS = [
  "Guindy", "Gopalapuram", "T. Nagar", "Adyar", "Anna Nagar",
  "Velachery", "Tambaram", "Porur", "Vadapalani", "Kodambakkam",
  "Mylapore", "Nungambakkam", "Egmore", "Thiruvanmiyur", "Besant Nagar",
  "Chromepet", "Pallavaram", "Sholinganallur", "Perungudi", "OMR",
  "ECR", "Koramangala", "HSR Layout", "Indiranagar", "Whitefield",
  "Electronic City", "Marathahalli", "Jayanagar", "Banashankari", "BTM Layout",
  "Andheri", "Bandra", "Juhu", "Powai", "Dadar", "Churchgate",
  "Gachibowli", "Madhapur", "Hitech City", "Kukatpally", "Begumpet",
  "Connaught Place", "Hauz Khas", "Lajpat Nagar", "Dwarka", "Noida",
  "Gurgaon", "Salt Lake", "Park Street", "Howrah"
];
LOCATIONS.forEach(l => locationTrie.insert(l));

export { locationTrie, LOCATIONS };
