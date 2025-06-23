import { ActionSchema } from "../../core/action/Action.type";
import { ResourceSchema } from "./resource";

export const bindResourceActionSchema: ActionSchema = {
    name: 'bindResource',
    title: "绑定资源",
    description: '绑定资源',
    payloadSchema: ResourceSchema
}
