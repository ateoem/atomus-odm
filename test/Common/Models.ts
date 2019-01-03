import MappedDocument from "../../src/Model/Document/MappedDocument";
import ChildField from "../../src/Model/Mapping/Fields/ChildField";
import ChildrenField from "../../src/Model/Mapping/Fields/ChildrenField";
import IdField from "../../src/Model/Mapping/Fields/IdField";
import StringField from "../../src/Model/Mapping/Fields/StringField";
import { Builder } from "../Infrastructure/Common/Builder";

export const AuthorMapping = Builder
.mapping("author")
.addField(new IdField("id"))
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

export const RootPostFactory = (id: string, content: string, author: MappedDocument, comments: MappedDocument[]) => {
        return Builder
        .mappedDocument(RootPostMapping)
        .addFieldValue("id", id)
        .addFieldValue("content", content)
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

export const mappings = [
        AuthorMapping,
        CommentMapping, RootAuthorMapping, RootCommentMapping, RootPostMapping, RootUserMapping];
