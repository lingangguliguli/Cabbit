import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('**/*.{js,jsx}', { ignore: ['node_modules/**', 'dist/**'] });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  const lines = content.split('\n');
  const cleanLines = lines.filter(line => !/^\s*\/\//.test(line));
  
  content = cleanLines.join('\n');
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned:', file);
  }
});
