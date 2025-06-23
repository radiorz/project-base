import { ActionSchema } from "../../core/action/Action.type";
import { ResourceSchema } from "./resource";

export const unbindResourceActionSchema: ActionSchema = {
    name: 'unbindResource',
    title: "解绑资源",
    description: '解绑资源',
    payloadSchema: ResourceSchema
}
