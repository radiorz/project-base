# time-manager

定时获取时间，这个功能广泛应用在普通的时钟显示与简单的定时任务中
该包主要分为 获取时间的Ticker 和过滤时间的 Timer两个类

Ticker 负责更新时间

默认采用Date.now()进行时间的获取。
但当不信任本地时钟时，则可以传入 getNow 函数自定义获取时间
目前的Ticker基于 setInterval ，是定时去主动调用getNow 获取时间，实际时间会有所偏差，偏差度小于毫秒级的精度 accuracy 你可以更改这个accuracy进行更小精度的时间获取

未来可以开发其他基于被动获取的Ticker.也就是别人推Ticker直接接受，这样在高要求的时候可以更好的控制精度。

Timer 负责在进入有效时间时回调用户传入的 onTime 函数
这个决定是否是有效时间的判断函数叫做 isOnTime，默认内置了秒、分、时、天这四个周期判断函数你可以直接传入字符串使用他们。
你甚至可以定制isOnTime，判断是否是每天4点触发，由于是函数所以你可以想到很多设定并应用。

## 使用

### 最简单使用方式，直接使用timer

```javascript
import { Timer } from '../lib';
const timer = new Timer({
  isOnTime: 'second',
  onTime: (now) => {
    console.log(`timer1`, now);
  },
});
```

### 多个timer 共用一个 ticker

```javascript
import { Timer } from '../lib';
const ticker = new Ticker();
const timer = new Timer({
  ticker,
  isOnTime: 'second',
  onTime: (now) => {
    console.log(`timer1`, now);
  },
});
const timer2 = new Timer({
  ticker,
  isOnTime: 'second',
  onTime: (now) => {
    console.log(`timer2`, now);
  },
});
// 停止某个timer,其他 timer2 会继续运行。
timer.stop();

// ticker 上的所有timer全部停止 ticker 也随即停止
timer2.stop(); // ticker=>stop
```
