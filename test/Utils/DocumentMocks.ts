import { AuthorFactory, CommentFactory, RootAuthorFactory, RootCommentFactory, RootPostFactory } from "../Common/Models";

export const mockPostJson = ($symbol) => ({
    [$symbol]: { documentName: "root_post" },
    id: "c2fe0cb6-a6c7-4378-b011-3cf7b234a2a4",
    title: "Proin cursus fringilla nibh, id.",
    author: {
        name: "Berkly",
        surname: "Bowery"
    },
    comments: [
        {
            author: {
                name: "Aurore",
                surname: "Haisell"
            },
            content: "Sed mollis turpis id tristique."
        },
        {
            author: {
                name: "Ruthann",
                surname: "Davet"
            },
            content: "Integer efficitur quam ante, sit."
        },
        {
            author: {
                name: "Alysia",
                surname: "Titheridge"
            },
            content: "Sed sodales non mauris et."
        }
    ]
});

export const mockAuthorJson = ($symbol) => ({
    id: "9181ee1a-030b-40d3-9d2c-168db5c03c5e",
    name: "test",
    surname: "ipsum",
    [$symbol]: {
        documentName: "root_author",
    },
});

export const mockCommentJson = ($symbol) => ({
    [$symbol]: { documentName: "root_comment" },
    id: "48b58a17-fe32-4d8b-8cd2-cff149998d25",
    content: "Proin tellus enim, aliquam a.",
    author: {
        name: "Berkly",
        surname: "Bowery"
    }
});

export const mockRootPost = () => RootPostFactory("c2fe0cb6-a6c7-4378-b011-3cf7b234a2a4", "Proin cursus fringilla nibh, id.", mockAuthorMapped(), mockCommentsMapped());
export const mockRootAuthorMapped = () => RootAuthorFactory("9181ee1a-030b-40d3-9d2c-168db5c03c5e", "test", "ipsum");
export const mockRootCommentMapped = () => RootCommentFactory("48b58a17-fe32-4d8b-8cd2-cff149998d25", "Proin tellus enim, aliquam a.", mockAuthorMapped());
export const mockCommentsMapped = () => [
    ["Aurore", "Haisell", "Sed mollis turpis id tristique."],
    ["Ruthann", "Davet", "Integer efficitur quam ante, sit."],
    ["Alysia", "Titheridge", "Sed sodales non mauris et."]
].map(([name, surname, content]) => CommentFactory(content, AuthorFactory(name, surname)));

export const mockAuthorMapped = () => AuthorFactory("Berkly", "Bowery");
