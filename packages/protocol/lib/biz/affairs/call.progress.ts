// ● 主叫方开始呼叫：10 %
// ● 被叫方收到呼入：20 %
// ● 被叫方接受呼入：30 %
// ● 呼叫或呼入被接通：40 %
// ● 主叫或被叫流媒被接通（通话中）：50 %
// ● 呼叫或呼入被挂断：60 %
// ● 主叫或被叫流媒断开中：90 %
// ● 主叫或被叫流媒已断开（呼叫结束）：100 %
export const CallProgress = {
  start: 10,
  ringing: 20,
  accept: 30,
  connected: 40,
  mediaConnected: 50,
  end: 60,
  mediaEnd: 90,
  allEnd: 100
}
// 这里可以结合给callevent