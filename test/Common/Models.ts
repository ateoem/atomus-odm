import ChildField from "../../src/Model/Mapping/Field/ChildField";
import ChildrenField from "../../src/Model/Mapping/Field/ChildrenField";
import StringField from "../../src/Model/Mapping/Field/StringField";
import IdField from "../../src/Model/Mapping/Field/UuidField";
import MappedDocument from "../../src/Model/ODM/MappedDocument";
import { Builder } from "../Infrastructure/Common/Builder";

export const AuthorMapping = Builder
.mapping("author")
.addField(new StringField("name"))
.addField(new StringField("surname"))
.build();

export const RootAuthorMapping = Builder
.mapping("root_author")
.addField(new IdField("id"))
.addField(new StringField("name"))
.addField(new StringField("surname"))
.build();

export const CommentMapping = Builder
        .mapping("comment")
        .addField(new StringField("content"))
        .addField(new ChildField("author", AuthorMapping))
        .build();

export const RootCommentMapping = Builder
        .mapping("root_comment")
        .addField(new IdField("id"))
        .addField(new StringField("content"))
        .addField(new ChildField("author", AuthorMapping))
        .build();

export const RootPostMapping = Builder
        .mapping("root_post")
        .addField(new IdField("id"))
        .addField(new StringField("title"))
        .addField(new ChildrenField("comments", CommentMapping))
        .addField(new ChildField("author", AuthorMapping))
        .build();

export const RootUserMapping = Builder
    .mapping("root_user")
    .addField(new IdField("id"))
    .addField(new StringField("name"))
    .addField(new StringField("surname"))
    .build();

export const RootPostFactory = (id: string, title: string, author: MappedDocument, comments: MappedDocument[]) => {
        return Builder
        .mappedDocument(RootPostMapping)
        .addFieldValue("id", id)
        .addFieldValue("title", title)
        .addFieldValue("author", author)
        .addFieldValue("comments", comments)
        .build();
    };

export const RootAuthorFactory = (id: string, name: string, surname: string) => {
        return Builder
        .mappedDocument(RootAuthorMapping)
        .addFieldValue("id", id)
        .addFieldValue("name", name)
        .addFieldValue("surname", surname)
        .build();
};

export const AuthorFactory = (name: string, surname: string) => {
        return Builder
        .mappedDocument(AuthorMapping)
        .addFieldValue("name", name)
        .addFieldValue("surname", surname)
        .build();
};

export const RootCommentFactory = (id: string, content: string, author: MappedDocument) => {
        return Builder
        .mappedDocument(RootCommentMapping)
        .addFieldValue("id", id)
        .addFieldValue("content", content)
        .addFieldValue("author", author)
        .build();
};

export const CommentFactory = (content: string, author: MappedDocument) => {
        return Builder
        .mappedDocument(CommentMapping)
        .addFieldValue("content", content)
        .addFieldValue("author", author)
        .build();
};

export const mappings = [
        AuthorMapping,
        CommentMapping, RootAuthorMapping, RootCommentMapping, RootPostMapping, RootUserMapping];
