import DocumentChange from "./DocumentChange";

class DocumentChanges {
    private changed: Map<string, DocumentChange>;

    constructor() {
        this.changed = new Map();
    }

    public setChange(change: DocumentChange) {
        this.changed.set(change.$field.$name, change);
    }

    public get $changed(): Map<string, DocumentChange> {
        return this.changed;
    }

    public get(key: string): DocumentChange {
        return this.changed.get(key);
    }

    public set(key: string, value: DocumentChange) {
        return this.changed.set(key, value);
    }

    public has(key: string): boolean {
        return this.changed.has(key);
    }

    public size(): number {
        return this.changed.size;
    }
}

export default DocumentChanges;
