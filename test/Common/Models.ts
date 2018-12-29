import ChildField from "../../src/Model/Mapping/Fields/ChildField";
import ChildrenField from "../../src/Model/Mapping/Fields/ChildrenField";
import IdField from "../../src/Model/Mapping/Fields/IdField";
import StringField from "../../src/Model/Mapping/Fields/StringField";
import Builder from "../Infrastructure/Common/Builder";

export const AuthorMapping = Builder
.mapping("author")
.addField(new StringField("name"))
.addField(new StringField("surname"))
.build();

export const CommentMapping = Builder
        .mapping("comment")
        .addField(new StringField("content"))
        .addField(new ChildField("author", AuthorMapping))
        .build();

export const PostMapping = Builder
        .mapping("blogpost")
        .addField(new IdField("id"))
        .addField(new StringField("title"))
        .addField(new ChildrenField("comments", CommentMapping))
        .addField(new ChildField("author", AuthorMapping))
        .build();

export const UserDocument = Builder
    .mapping("user")
    .addField(new IdField("id"))
    .addField(new StringField("name"))
    .addField(new StringField("surname"))
    .build();
