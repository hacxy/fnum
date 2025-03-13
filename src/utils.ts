import path from 'node:path';
import { globSync } from 'tinyglobby';

interface Options {
  dir?: string
  patternExts?: string[]
  ignoreExts?: string[]
}

export function getTargetDirFiles(options: Options) {
  const { dir = '', patternExts = [], ignoreExts = [] } = options;
  const patterns = patternExts.map(ext => `**/*${ext}`);
  if (patterns.length === 0) {
    patterns.push('**/*');
  }
  const ignore = ignoreExts.map(ext => `**/*${ext}`);
  const files = globSync(patterns, { cwd: path.resolve(process.cwd(), dir), ignore: ['node_modules/**/*', ...ignore] });
  return files;
}

// 封装函数, 入参为文件路径数组, 找出所有文件的每个扩展名的名称以及它所对应的数量
export function getExtensionsCount(files: string[]) {
  const exts = files.map(file => file.split('.').pop());
  const extsCount = exts.reduce((acc: { [key: string]: number }, ext: string | undefined) => {
    if (ext) {
      acc[ext] = (acc[ext] || 0) + 1;
    }
    return acc;
  }, {});
  return extsCount;
}

// 封装函数, 入参为文件路径数组, 找出所有文件的每个扩展名的名称以及它的占比
export function getExtensionsPercent(files: string[]) {
  const extsCount = getExtensionsCount(files);
  const extsPercent = Object.entries(extsCount).reduce((acc: { [key: string]: number }, [ext, count]) => {
    acc[ext] = count / files.length;
    // 保留两位小数
    acc[ext] = Math.round(acc[ext]
      * 10 ** 2) / 10 ** 2;
    return acc;
  }, {});
  return extsPercent;
}
