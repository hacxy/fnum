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
    // 保留两位小数,  如果计算出来的值为0 则保留三位小数
    acc[ext] = Math.round(acc[ext] * 10 ** 2) / 10 ** 2;

    if (acc[ext] === 0) {
      acc[ext] = Math.round(acc[ext] * 10 ** 3) / 10 ** 3;
    }
    return acc;
  }, {});
  return extsPercent;
}

export function getTSExtensionsPercent() {
  const files = getTargetDirFiles({ dir: 'src', patternExts: ['.js', 'cjs', '.mjs', '.jsx', '.ts', '.tsx', '.cts', '.mts'] });
  // 获取所有javascript文件 包括 cjs mjs js jsx
  const jsFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.cjs') || file.endsWith('.mjs'));
  // 获取所有typescript文件 包括 ts tsx cts mts
  const tsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.cts') || file.endsWith('.mts'));
  // 计算javascript文件和typescript文件的占比 保留两位小数 四舍五入
  const jsPercent = Math.round(jsFiles.length / files.length * 10 ** 2) / 10 ** 2;
  const tsPercent = Math.round(tsFiles.length / files.length * 10 ** 2) / 10 ** 2;
  return { total: files.length, jsPercent, tsPercent };
}
