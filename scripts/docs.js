import * as documentation from 'documentation';
import fs from 'fs';

const modules = [
    { name: 'string', entry: 'src/string.js', marker: 'GENERATED:string', title: 'String Utilities' },
    { name: 'array', entry: 'src/array.js', marker: 'GENERATED:array', title: 'Array Utilities' },
    { name: 'is', entry: 'src/is.js', marker: 'GENERATED:is', title: 'Type Checking' },
    { name: 'random', entry: 'src/random.js', marker: 'GENERATED:random', title: 'Random Utilities' },
    { name: 'traversal', entry: 'src/traversal.js', marker: 'GENERATED:traversal', title: 'Traversal Utilities' },
    { name: 'math', entry: 'src/math.js', marker: 'GENERATED:math', title: 'Math Utilities' },
    { name: 'utils', entry: 'src/utils.js', marker: 'GENERATED:utils', title: 'General Utilities' },

    { name: 'dom', entry: 'src/dom.js', marker: 'GENERATED:dom', title: 'DOM utilities' },
    { name: 'eventDispatcher', entry: 'src/eventDispatcher.js', marker: 'GENERATED:eventDispatcher', title: 'Event Dispatcher' },
    { name: 'translator', entry: 'src/Translator.js', marker: 'GENERATED:translator', title: 'Translator' },
    { name: 'mouse', entry: 'src/Mouse.js', marker: 'GENERATED:mouse', title: 'Mouse Utilities' },
];

async function build() {
    if (!fs.existsSync('docs')) fs.mkdirSync('docs');

    for (const module of modules) {
        const comments = await documentation.build([module.entry], { shallow: true });
        const output = await documentation.formats.md(comments, { github: true });

        const filePath = `docs/${module.name}.md`;

        if (!fs.existsSync(filePath)) {
            const baseContent = `# ${module.title}

Description of the ${module.title.toLowerCase()}.

## Import

\`\`\`js
import { ${module.name === 'core' ? 'default as webf' : module.name} } from '@webalternatif/js-core'
\`\`\`

---

## API
<!-- ${module.marker} -->
`;
            fs.writeFileSync(filePath, baseContent);
        }

        let content = fs.readFileSync(filePath, 'utf8');

        const regex = new RegExp(`<!-- ${module.marker} -->[\\s\\S]*`, 'm');
        content = content.replace(regex, `<!-- ${module.marker} -->\n${output}`);

        fs.writeFileSync(filePath, content);
    }
}

build();
