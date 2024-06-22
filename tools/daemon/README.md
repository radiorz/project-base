# time-manager

将经常用到的计时功能独立搞个包 方便使用

## 使用

```javascript
import { TimeManager as AbstractTimeManager } from '@tikkhun/time-manager';

class TimeManager extends AbstractTimeManager {
  onMinutely(now) {
    console.log(`onMinutely`, now);
  }

  onHourly(now) {
    console.log(`onHourly`, now);
  }

  onDayly(now) {
    console.log(`onDayly`, now);
  }

  onTimeChange(now) {
    console.log(`onTimeChange`, now);
  }
}
export const timeManager = new TimeManager();
```
