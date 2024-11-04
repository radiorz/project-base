# fun-framework

鉴于 react 的 function + hook 的方式 开发一款基于function+hook风格的后端框架

最关键的是要搞定路由上下文。

路由的上下文一般就是req res
然后可以定义新的上下文 比如把 user 放到上下文中 token permission

```JS



const req = useReq()
const res = useRes()
// 定义
const ctx= useContext()
ctx.addProps("user", user)

// 使用
const user = useContext("user")
```

# 定义路由组件

```javascript
import { defineOptions, defineProps } from '@tikkhun/fun';
// 定义路由
function UserRoute() {
  defineOptions({
    path: '/a/*',
  });
  const props = defineProps({
    params: {},
    query: {},
  });
  return result;
}
```
