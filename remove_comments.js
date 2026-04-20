import fs from 'fs';
import { globSync } from 'glob';
import strip from 'strip-comments';
const files = globSync('**/*.{js,jsx,css,html}', { ignore: ['node_modules/**', 'dist/**'] });
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = strip(content);
  content = content.replace(/\{\s*\}/g, '');
  if (file.endsWith('.html')) {
    content = content.replace(/<!--[\s\S]*?-->/g, '');
  }
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  content = content.replace(/^\s*\n/gm, ''); // remove blank lines entirely? No, maybe keep single blank lines
  const lines = content.split('\n');
  const cleanLines = [];
  let prevEmpty = false;
  for (const line of lines) {
    const isEmpty = line.trim() === '';
    if (isEmpty && prevEmpty) continue;
    cleanLines.push(line);
    prevEmpty = isEmpty;
  }
  content = cleanLines.join('\n');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Stripped comments from:', file);
  }
});
console.log('Done!');
