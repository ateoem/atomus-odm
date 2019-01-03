import { RootAuthorFactory } from "../Common/Models";

export const mockAuthorJson = ($symbol) => ({
    id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
    name: "test",
    surname: "ipsum",
    [$symbol]: {
        documentName: "root_author",
    },
});

export const mockAuthorMapped = () => RootAuthorFactory("9181ee1a-030b-40d3-9d2c-168db5c03c5e", "test", "ipsum");
