import MappedDocument from "../Document/MappedDocument";
import DocumentMapping from "../Mapping/DocumentMapping";
import DocumentManager from "./DocumentManager";

interface IDocumentNormalizer {
    normalize(document: MappedDocument): object;
    denormalize(payload: any): MappedDocument;
    setDocumentManager(manager: DocumentManager);
}

export default IDocumentNormalizer;
