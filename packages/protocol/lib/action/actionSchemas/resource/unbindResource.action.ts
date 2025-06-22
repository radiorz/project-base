import { ActionSchema } from "../../Action.type";
import { ResourceSchema } from "./resource";

export const unbindResourceActionSchema: ActionSchema = {
    name: 'unbindResource',
    title: "解绑资源",
    description: '解绑资源',
    payloadSchema: ResourceSchema
}
