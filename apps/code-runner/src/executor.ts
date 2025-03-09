// import { Docker } from 'node-docker-api';
// import { Job, TestResult, ExecutionResult } from '@kraft/types';

// const docker = new Docker({ socketPath: '/var/run/docker.sock' });
// const TIMEOUT_MS = 10000; // 10 seconds per test case

// const languageImages = {
//   python: 'python-runner:latest',
//   cpp: 'cpp-runner:latest',
//   javascript: 'node-runner:latest'
// };

// export async function executeJob(job: Job): Promise<ExecutionResult> {
//   const results: TestResult[] = [];
  
//   for (const testCase of job.testCases) {
//     console.log('Executing test case:', testCase);
//     const startTime = process.hrtime();
    
//     // Create container with entrypoint
//     const container = await docker.container.create({
//       Image: languageImages[job.language],
//       Cmd: ['sleep', '1'], // Minimal sleep to keep container alive
//       HostConfig: {
//         AutoRemove: true,
//         Memory: 256 * 1024 * 1024,
//         NetworkMode: 'none'
//       },
//       OpenStdin: true
//     });

//     await container.start();

//     // Create exec instance
//     const exec = await container.exec.create({
//       Cmd: getCommand(job.language, job.code),
//       AttachStdin: true,
//       AttachStdout: true,
//       AttachStderr: true
//     });

//     // Get duplex stream
//     const stream = await exec.start({ hijack: true, stdin: true });
    
//     // Handle output
//     let stdout = '';
//     let stderr = '';
//     const outputParser = (chunk: Buffer) => {
//         console.log('Raw chunk:', chunk.toString('hex'));

//       const header = chunk.readUInt8(0);
//       const content = chunk.slice(8);
//       if (header === 1) stdout += content.toString();
//       if (header === 2) stderr += content.toString();
//     };

//     stream.on('data', outputParser);

//     // Write input and end stream
//     stream.write(Buffer.from(testCase.input));
//     stream.end();

//     // Wait for execution
//     const exitCode = await new Promise((resolve, reject) => {
//       const timer = setTimeout(() => {
//         stream.destroy();
//         reject('Timeout');
//       }, TIMEOUT_MS);

//       stream.on('end', () => {
//         clearTimeout(timer);
//         resolve(0);
//       });
//     });

//     // Calculate runtime
//     const [sec, nanosec] = process.hrtime(startTime);
//     const runtime = sec * 1000 + nanosec / 1e6;

//     // Get memory usage
//     const stats = await container.stats();
//     const memory = stats.memory_stats.usage / 1024 / 1024 || 0;

//     results.push({
//       ...testCase,
//       stdout: stdout.trim(),
//       stderr: stderr.trim(),
//       passed: stdout.trim() === testCase.expectedOutput.trim(),
//       runtime,
//       memory
//     });

//     await container.stop();
//   }

//     return {
//     jobId: job.id,
//     status: 'success',
//     results,
//     totalPassed: results.filter(r => r.passed).length,
//     totalCases: results.length,
//     averageRuntime: results.reduce((sum, r) => sum + r.runtime, 0) / results.length,
//     maxMemory: Math.max(...results.map(r => r.memory))
//   };
// }


// function getCommand(language: string, code: string): string[] {
//   switch(language) {
//     case 'python':
//       return ['python3', '-c', code];
//     case 'cpp':
//       return ['sh', '-c', `echo "${code}" > code.cpp && g++ code.cpp -o out && ./out`];
//     case 'javascript':
//       return ['node', '-e', code];
//     default:
//       throw new Error(`Unsupported language: ${language}`);
//   }
// }




import { Docker } from 'node-docker-api';
import { Job, TestResult, ExecutionResult } from '@kraft/types';

const DEBUG = true; // Enable detailed logging
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const TIMEOUT_MS = 10000;

const languageImages = {
  python: 'python-runner:latest',
  cpp: 'cpp-runner:latest',
  javascript: 'node-runner:latest'
};

const log = (...args: any[]) => DEBUG && console.log('[DEBUG]', new Date().toISOString(), ...args);

// Modified stats collection with logging
const getContainerStats = async (container: any): Promise<any> => {
  try {
    log('Getting stats for container');
    const stats = await container.stats();
    log('Raw stats:', typeof stats, stats);
    
    const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats;
    log('Parsed stats:', parsed);
    return parsed;
  } catch (e) {
    console.error('[STATS ERROR]', e);
    return {};
  }
};

export async function executeJob(job: Job): Promise<ExecutionResult> {
  const results: TestResult[] = [];
  log('Starting job:', job.id);
  
  for (const testCase of job.testCases) {
    const startTime = process.hrtime();
    let container: any = null;
    let stream: any = null;

    log(`Processing test case: ${testCase.input} => ${testCase.expectedOutput}`);
    
    try {
      // 1. Container creation
      log('Creating container');
      container = await docker.container.create({
        Image: languageImages[job.language],
        Cmd: ['tail', '-f', '/dev/null'],
        HostConfig: {
          AutoRemove: true,
          Memory: 256 * 1024 * 1024,
          NetworkMode: 'none'
        }
      });
      log('Container created:', container.id);

      // 2. Start container
      log('Starting container');
      await container.start();
      log('Container started');
      await new Promise(resolve => {
        log('Container warmup delay');
        setTimeout(resolve, 500);
      });

      // 3. Create exec instance
      const command = getCommand(job.language, job.code);
      log('Creating exec with command:', command);
      const exec = await container.exec.create({
        Cmd: command,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true
      });

      // 4. Execute command
      log('Starting execution stream');
      stream = await exec.start({ hijack: true, stdin: true });
      
      let stdout = '';
      let stderr = '';
      let outputClosed = false;

      stream.on('data', (chunk: Buffer) => {
        log('Received chunk:', chunk.toString('hex'));
        const header = chunk.readUInt8(0);
        const content = chunk.slice(8);
        if (header === 1) stdout += content.toString();
        if (header === 2) stderr += content.toString();
      });

      stream.on('end', () => {
        log('Stream ended');
        outputClosed = true;
      });

      stream.on('error', (err: Error) => {
        log('Stream error:', err);
      });

      // 5. Write input
      if (testCase.input) {
        log(`Writing input: "${testCase.input}"`);
        stream.write(Buffer.from(testCase.input + '\n'));
      }
      log('Ending input stream');
      stream.end();

      // 6. Wait with timeout
      log('Starting execution timer');
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          log(`Timeout after ${TIMEOUT_MS}ms`);
          stream.destroy();
          reject(new Error(`Timeout after ${TIMEOUT_MS}ms`));
        }, TIMEOUT_MS);

        stream.on('end', () => {
          log('Execution completed normally');
          clearTimeout(timer);
          resolve(true);
        });
      });

      // 7. Get metrics
      log('Getting execution metrics');
      const [sec, nanosec] = process.hrtime(startTime);
      const runtime = parseFloat((sec * 1000 + nanosec / 1e6).toFixed(2));
      
      const stats = await getContainerStats(container);
      const memory = stats?.memory_stats?.usage 
        ? parseFloat((stats.memory_stats.usage / 1024 / 1024).toFixed(2))
        : 0;

      log('Test case results:', {
        stdout,
        stderr,
        runtime,
        memory
      });

      results.push({
        ...testCase,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        passed: stdout.trim() === testCase.expectedOutput.trim(),
        runtime,
        memory
      });

    } catch (error) {
      log('Execution error:', error);
      results.push({
        ...testCase,
        stdout: '',
        stderr: error.message,
        passed: false,
        runtime: TIMEOUT_MS,
        memory: 256
      });
    } finally {
      log('Starting cleanup');
      try {
        if (stream) {
          log('Destroying stream');
          stream.destroy();
        }
        if (container) {
          log('Stopping container');
          await container.stop();
          log('Container stopped');
        }
      } catch (e) {
        console.error('[CLEANUP ERROR]', e);
      }
      log('Cleanup completed');
    }
  }

  return {
    jobId: job.id,
    status: 'success',
    results,
    totalPassed: results.filter(r => r.passed).length,
    totalCases: results.length,
    averageRuntime: parseFloat((
      results.reduce((sum, r) => sum + r.runtime, 0) / results.length
    ).toFixed(2)),
    maxMemory: parseFloat((
      Math.max(...results.map(r => r.memory))).toFixed(2))
  };
}

function getCommand(language: string, code: string): string[] {
  const sanitized = code
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/`/g, '\\`');

  log('Sanitized code:', sanitized);
  
  switch(language) {
    case 'python':
      return ['python3', '-u', '-c', sanitized];
    case 'cpp':
      return ['sh', '-c', `echo "${sanitized}" > code.cpp && g++ code.cpp -o out && ./out`];
    case 'javascript':
      return ['node', '-e', sanitized];
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}