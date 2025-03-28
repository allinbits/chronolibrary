import fg from "fast-glob";
import fs from "node:fs";
import matter from 'gray-matter';

function getTitle(content: string): string | undefined {
    const regex = /^#\s*(.+)$/m;  // Matches the first header after "# " (title)
    const match = content.match(regex);
    if (!match) {
        return undefined;
    }

    return match[1].replaceAll('`', '')
}

/**
 * Pulls all markdown files from a given folder.
 * Takes the given files and determines a name based on markdown header level.
 * Additionally if `order` is present in the front-matter it'll order the markdown documents.
 *
 * @export
 * @param {string} baseDir
 * @return {*} 
 */
export function generateSidebar(baseDir: string) {
    const files = fg.sync(`${baseDir}/**/*.md`, { ignore: ["node_modules"] });
    
    const formattedFiles: Array<{ text: string, link: string, order: number }> = [];
    for(let file of files){
        file = file.replace(/\\/g, '/');
        const fileContent = fs.readFileSync(file, 'utf-8');
        
        let fileTitle = getTitle(fileContent);
        if (!fileTitle) {
            const filePathSplit = file.split('/');
            const fileName = filePathSplit[filePathSplit.length - 1];
            fileTitle = fileName.replace('.md', '');
        }

        const frontMatter = matter(fileContent);
        const order = frontMatter.data['order'] ?? -1;

        formattedFiles.push({ text: fileTitle, link: file.replace('docs', ''), order });
    }

    formattedFiles.sort((a, b) => {
        return b.order - a.order;
    })

    return formattedFiles;
}
  