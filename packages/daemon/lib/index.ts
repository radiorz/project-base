const fs = require('fs');
const { spawn } = require('child_process');

// 定义日志文件的路径
const logFile = 'app_log.txt';

function bootstrap(scriptPath = './index.js') {
  console.log('Starting server...');

  // 启动 Node.js 服务
  const child = spawn('node', [scriptPath], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('close', (code: any) => {
    console.log(`Child process exited with code ${code}`);

    // 如果子进程异常退出,则重启服务
    if (code !== 0) {
      console.log('Restarting server...');
      bootstrap();
    }
  });

  child.on('error', (err: any) => {
    console.error('Error starting server:', err);
    logError(err);
  });
}

function logError(error: any) {
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${error.stack}\n`);
}

bootstrap();
