import mri from 'mri';
import { getExtensionsCount, getExtensionsPercent, getTargetDirFiles } from './utils';

export function bootstrap() {
  const argv = process.argv.slice(2);
  const args = mri(argv, {
    alias: {
      h: 'help',
      v: 'version',
      d: 'dir',
      p: 'patternExts',
      i: 'ignoreExts',
    },
    boolean: ['help', 'version'],
  });

  const { dir, patternExts, ignoreExts } = args;
  const files = getTargetDirFiles({ dir, patternExts: patternExts?.split(','), ignoreExts: ignoreExts?.split(',') });
  console.log('count:', files.length);

  // 找出所有文件的每个扩展名的名称以及它所对应的数量
  const extsCount = getExtensionsCount(files);
  console.log('Extensions count:', extsCount);

  // 找出所有文件的每个扩展名的名称以及它的占比
  const extsPercent = getExtensionsPercent(files);
  console.log('Extensions percent:', extsPercent);
}

