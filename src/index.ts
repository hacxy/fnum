import cac from 'cac';
import { getExtensionsCount, getExtensionsPercent, getTargetDirFiles, getTSExtensionsPercent } from './utils';

export function bootstrap() {
  const cli = cac();
  cli.command('statis', 'Count the number of files in the target directory')
    .option('-d,--dir <dir>', 'Target Directory')
    .option('-p,--patternExts <patternExts>', 'Pattern Extensions')
    .option('-i,--ignoreExts <ignoreExts>', 'Ignore Extensions')
    .action(options => {
      console.log(options);
      const { dir, patternExts, ignoreExts } = options;
      const files = getTargetDirFiles({ dir, patternExts: patternExts?.split(','), ignoreExts: ignoreExts?.split(',') });
      console.log('File count:', files.length);

      // 找出所有文件的每个扩展名的名称以及它所对应的数量
      const extsCount = getExtensionsCount(files);
      console.log('Extensions count:', extsCount);

      // 找出所有文件的每个扩展名的名称以及它的占比
      const extsPercent = getExtensionsPercent(files);
      console.log('Extensions percent:', extsPercent);
    });

  cli.command('percent [language]', 'Count the number of files in the target directory').action(language => {
    if (language === 'ts') {
      console.log(getTSExtensionsPercent());
    }
  });

  cli.help();
  cli.parse(process.argv);
}

