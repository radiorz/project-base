import cliSpinners from 'cli-spinners';
import _ from 'lodash';
import { clearLine, cursorTo } from 'readline';
const { merge } = _;
export interface ProgressOptions {
  interval: number;
  frames: string[];
  buildMessage: Function;
}
export class ProgressPrinter {
  static defaultOptions: ProgressOptions = {
    interval: 200,
    frames: cliSpinners.dots.frames,
    buildMessage: ({ currentFrame }: any) => {
      return `${currentFrame}`;
    },
  };
  options: ProgressOptions;
  intervalId: any = null; // 自动打印
  hasPrintOne = false; // 已经打印了一个了
  snipperDot: Generator;
  constructor(options: Partial<ProgressOptions>) {
    this.options = merge({}, ProgressPrinter.defaultOptions, options);
    this.snipperDot = getNextSpinnerDot(this.options.frames);
  }

  // ticker 会一直进来调用这个print
  print() {
    // 第一次不清空
    if (!this.hasPrintOne) {
      this.hasPrintOne = true;
    } else {
      // 清空
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
    }
    // 输出
    const message = this.options.buildMessage({ currentFrame: this.snipperDot.next().value });
    process.stdout.write(message);
    this.intervalId && clearInterval(this.intervalId);
    // 内部启动一个ticker,在外部ticker 很久没调用的时候我还可以调用，以防止外部很久调用一次看起来卡死
    this.intervalId = setInterval(() => {
      this.print();
    }, this.options.interval);
  }
  end() {
    this.intervalId && clearInterval(this.intervalId);
  }
}

export function* getNextSpinnerDot(frames: string[]) {
  let index = 0;
  while (true) {
    yield frames[index];
    index = (index + 1) % frames.length;
  }
}
