import DocumentMapping from "../Schema/DocumentMapping";
import DocumentManager from "./DocumentManager";
import MappedDocument from "./MappedDocument";

interface IDocumentNormalizer {
    normalize(document: MappedDocument): object;
    denormalize(payload: any): MappedDocument;
    setDocumentManager(manager: DocumentManager);
}

export default IDocumentNormalizer;
