import DocumentManager from "../../../src/Model/ODM/DocumentManager";
import DocumentRepository from "../../../src/Model/ODM/DocumentRepository";
import DocumentMapping from "../../../src/Model/Schema/DocumentMapping";

class DocumentManagerMock extends DocumentManager {
    constructor($normalizer) {
        super($normalizer);
    }

    public flush() {
        return 1;
    }

    public getRepository(mapping: string | DocumentMapping): DocumentRepository {
        throw new Error("Method not implemented.");
    }
}

export default DocumentManagerMock;
