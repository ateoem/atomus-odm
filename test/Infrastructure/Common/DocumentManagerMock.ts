import DocumentMapping from "../../../src/Model/Mapping/FieldCollection";
import DocumentManager from "../../../src/Model/ODM/DocumentManager";
import DocumentRepository from "../../../src/Model/ODM/DocumentRepository";

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
