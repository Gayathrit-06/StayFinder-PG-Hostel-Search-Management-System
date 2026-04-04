#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

struct HostelRecord {
    string id;
    string name;
    string location;
    int rent;
};

class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd;
    string word;

    TrieNode() : isEnd(false) {}
};

class Trie {
private:
    TrieNode* root;

    void collect(TrieNode* node, vector<string>& results) {
        if (!node) return;
        if (node->isEnd) results.push_back(node->word);
        for (auto& pair : node->children) {
            collect(pair.second, results);
        }
    }

    char lowerChar(char c) {
        return static_cast<char>(tolower(static_cast<unsigned char>(c)));
    }

public:
    Trie() {
        root = new TrieNode();
    }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            char ch = lowerChar(c);
            if (!node->children.count(ch)) {
                node->children[ch] = new TrieNode();
            }
            node = node->children[ch];
        }
        node->isEnd = true;
        node->word = word;
    }

    vector<string> search(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            char ch = lowerChar(c);
            if (!node->children.count(ch)) return {};
            node = node->children[ch];
        }
        vector<string> results;
        collect(node, results);
        sort(results.begin(), results.end());
        return results;
    }
};

class BSTNode {
public:
    HostelRecord data;
    BSTNode* left;
    BSTNode* right;

    BSTNode(const HostelRecord& hostel) : data(hostel), left(nullptr), right(nullptr) {}
};

class HostelBST {
private:
    BSTNode* root = nullptr;

    BSTNode* insert(BSTNode* node, const HostelRecord& hostel) {
        if (!node) return new BSTNode(hostel);
        if (hostel.rent < node->data.rent) node->left = insert(node->left, hostel);
        else node->right = insert(node->right, hostel);
        return node;
    }

    void rangeSearch(BSTNode* node, int minRent, int maxRent, vector<HostelRecord>& result) {
        if (!node) return;
        if (node->data.rent > minRent) rangeSearch(node->left, minRent, maxRent, result);
        if (node->data.rent >= minRent && node->data.rent <= maxRent) result.push_back(node->data);
        if (node->data.rent < maxRent) rangeSearch(node->right, minRent, maxRent, result);
    }

public:
    void insert(const HostelRecord& hostel) {
        root = insert(root, hostel);
    }

    vector<HostelRecord> filterByRent(int minRent, int maxRent) {
        vector<HostelRecord> result;
        rangeSearch(root, minRent, maxRent, result);
        return result;
    }
};

class AVLNode {
public:
    HostelRecord data;
    AVLNode* left;
    AVLNode* right;
    int height;

    AVLNode(const HostelRecord& hostel) : data(hostel), left(nullptr), right(nullptr), height(1) {}
};

class HostelAVL {
private:
    AVLNode* root = nullptr;

    int getHeight(AVLNode* node) {
        return node ? node->height : 0;
    }

    int getBalance(AVLNode* node) {
        return node ? getHeight(node->left) - getHeight(node->right) : 0;
    }

    void updateHeight(AVLNode* node) {
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    }

    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* t2 = x->right;
        x->right = y;
        y->left = t2;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* t2 = y->left;
        y->left = x;
        x->right = t2;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    AVLNode* insert(AVLNode* node, const HostelRecord& hostel) {
        if (!node) return new AVLNode(hostel);

        if (hostel.rent < node->data.rent) node->left = insert(node->left, hostel);
        else node->right = insert(node->right, hostel);

        updateHeight(node);
        int balance = getBalance(node);

        if (balance > 1 && hostel.rent < node->left->data.rent) return rightRotate(node);
        if (balance < -1 && hostel.rent > node->right->data.rent) return leftRotate(node);
        if (balance > 1 && hostel.rent > node->left->data.rent) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }
        if (balance < -1 && hostel.rent < node->right->data.rent) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

    void inOrder(AVLNode* node, vector<HostelRecord>& result) {
        if (!node) return;
        inOrder(node->left, result);
        result.push_back(node->data);
        inOrder(node->right, result);
    }

public:
    void insert(const HostelRecord& hostel) {
        root = insert(root, hostel);
    }

    vector<HostelRecord> getSortedByRent() {
        vector<HostelRecord> result;
        inOrder(root, result);
        return result;
    }
};

class HostelHashMap {
private:
    unordered_map<string, HostelRecord> table;

public:
    void insert(const HostelRecord& hostel) {
        table[hostel.id] = hostel;
    }

    bool exists(const string& hostelId) {
        return table.find(hostelId) != table.end();
    }

    HostelRecord get(const string& hostelId) {
        return table.at(hostelId);
    }
};

int main() {
    vector<HostelRecord> hostels = {
        {"h1", "Sunrise PG", "Guindy", 7500},
        {"h2", "Blossom Ladies Hostel", "Anna Nagar", 8500},
        {"h3", "Green Valley PG", "Velachery", 5500},
        {"h4", "Elite Women Hostel", "T. Nagar", 9500}
    };

    Trie locationTrie;
    HostelBST rentBST;
    HostelAVL avlTree;
    HostelHashMap hostelMap;

    for (const auto& hostel : hostels) {
        locationTrie.insert(hostel.location);
        rentBST.insert(hostel);
        avlTree.insert(hostel);
        hostelMap.insert(hostel);
    }

    cout << "Trie search for 'G':\n";
    for (const auto& location : locationTrie.search("G")) {
        cout << "- " << location << "\n";
    }

    cout << "\nBST filter by rent 6000 to 9000:\n";
    for (const auto& hostel : rentBST.filterByRent(6000, 9000)) {
        cout << hostel.name << " - Rs." << hostel.rent << "\n";
    }

    cout << "\nAVL sorted by rent:\n";
    for (const auto& hostel : avlTree.getSortedByRent()) {
        cout << hostel.name << " - Rs." << hostel.rent << "\n";
    }

    cout << "\nHashMap lookup for h2:\n";
    if (hostelMap.exists("h2")) {
        HostelRecord hostel = hostelMap.get("h2");
        cout << hostel.name << " in " << hostel.location << " - Rs." << hostel.rent << "\n";
    }

    return 0;
}
