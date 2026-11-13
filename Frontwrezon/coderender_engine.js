import { Theme } from '@shikijs/vscode-textmate';
import {marked, Marked} from 'marked';
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki';
import MarkedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css';

let highlighter = null;
let markedInstance = null;


const options = {throwOnError: false,
    nonStandard: true
}


export async function initMarkdownRendered() {
    if (markedInstance) return;

    highlighter = await createHighlighter({
        engine: createJavaScriptRegexEngine(),
        themes:['github-dark'],
        langs:    [
            'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
            'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
            'html', 'css', 'scss', 'json', 'xml', 'yaml',
            'sql', 'bash', 'sh', 'vue', 'jsx', 'tsx',
            'markdown', 'latex', 'r', 'matlab', 'lua', 'perl']
        //['python','javascript','html','css','json','bash','sql','cpp']
    })
    
    markedInstance = new Marked()

    markedInstance.use(MarkedKatex(options),{
        renderer:createShikiRender()
    })
    console.log("Markdow + Shiki Engine Ready");
    
}
function expandView(el) {
    //el.classList.add("sim-expanded");
    const codeCisplay = el.closest(".code-block-wrapper");
    codeCisplay.classList.toggle("code-expanded");
}
async function copycode(el) {
    const text = el.closest(".code-block-wrapper").querySelector("pre").innerText;
    const label = el.querySelector(".sim-copy-label");

    try {
        await navigator.clipboard.writeText(text);
        label.textContent = "Copied!";
    } catch {
        label.textContent = "Failed";
    }
    setTimeout(() => (label.textContent = "Copy"), 1600);
}
window.expandView = expandView;
window.copycode = copycode;

function createShikiRender() {
    return {
        code(tokenOrText, langArg) {
            let codeText = '';
            let language = 'text';

            // Handle Marked v12+ token object vs older positional parameters
            if (typeof tokenOrText === 'object' && tokenOrText !== null) {
                codeText = tokenOrText.text || tokenOrText.raw || '';
                language = tokenOrText.lang || 'text';
            } else {
                codeText = String(tokenOrText || '');
                language = langArg || 'text';
            }

            // Clean up language string (e.g., "python" from "```python")
            language = language.trim().toLowerCase();

            // Check if language is loaded in Shiki, otherwise fallback to plain text
            const loadedLangs = highlighter.getLoadedLanguages();
            if (!loadedLangs.includes(language)) {
                language = 'text';
            }

            try {
                const highlightedHtml = highlighter.codeToHtml(codeText, {
                    lang: language,
                    theme: 'github-dark'
                });
                const data = highlightedHtml;

                
                
                   
                

                return `
                    <div class="code-block-wrapper">
                        <div class="code-header">
                            <span class="code-lang">${language}</span>
                            <div class="copy-expand-btn" onclick="expandView(this)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <g transform="rotate(45 12 12)">
                                            <polyline points="9 7 4 12 9 17" />
                                            <polyline points="15 7 20 12 15 17" />
                                        </g>
                                    </svg>
                            </div>
                            <div class="sim-copy-btn"  id = "copycode" onclick = copycode(this)>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span class="sim-copy-label">Copy</span>
                            </div>
                        </div>
                        ${highlightedHtml}
                    </div>
                `;
            } catch (err) {
                // Fallback rendering if Shiki throws
                return `
                    <div class="code-block-wrapper">
                        <div class="code-header">
                            <span class="code-lang">${language}</span>
                            
                        </div>
                        
                        <pre><code>${codeText}</code></pre>
                    </div>
                `;
            }
        }
    };
}

//export function renderMarkdown(markdownText){
    //if (!markedInstance){
       // console.warn("Render called before initialization complete");
       // return markdownText;
   // }
   
   // return markedInstance.parse(markdownText)
//}

//export function renderMarkdown(markdownText) {
    //if (!markedInstance) return markdownText;

    // 1. Normalize linebreaks
   //let cleanText = markdownText.replace(/\\n/g, '\n');

    // 2. FIX MATH NOISE: Convert inline double-dollars ($$ ... $$) into single-dollars ($ ... $)
    // This catches inline $$ math without messing up multi-line display blocks
    //cleanText = cleanText.replace(/(?<!\n)\$\$(.*?)\$\$/g, '$$1$');
    
    //return markedInstance.parse(cleanText);
//}
export function renderMarkdown(markdownText) {
    if (!markedInstance) return markdownText;

    let cleanText = markdownText;
    // 1. Normalize literal escaped newlines ("\n" string -> real newline character)
    cleanText = cleanText.replace(/\\n/g, '\n');

    // 2. Reduce excessive backslashes (\\\\ -> \\) if double-escaped from API JSON response
    cleanText = cleanText.replace(/\\\\/g, '\\');

    // 3. Convert LaTeX display math \[ ... \] to standard $$ ... $$
    cleanText = cleanText.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, '\n$$\n$1\n$$\n');

    // 4. Convert LaTeX inline math \( ... \) to standard $ ... $
    cleanText = cleanText.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, '$1$');

    // 5. Clean up redundant blank lines (preserve Markdown table/paragraph spacing)
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n');
    
   return markedInstance.parse(cleanText);
}
