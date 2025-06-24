

## 消息的分类的结构如下

- message
  - action
    - request
    - response
    - exec
  - event
    - alarm
    - status
    - config
    - ...


实际上action可以被抹杀掉，因为可以直接由request response exec代替 这样 subType就可以上位成type了

