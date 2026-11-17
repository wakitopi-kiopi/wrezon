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
function registerCustomTags(markedInstance, tagNames = ["mark-important", "callout", "warning", "key"]) {
    const tagPattern = tagNames.join("|");

    markedInstance.use({
        extensions: [{
            name: "customTag",
            level: "block",
            start(src) {
                const re = new RegExp(`<(${tagPattern})[\\s>]`);
                return src.match(re)?.index;
            },
            tokenizer(src) {
                const re = new RegExp(
                    `^<(${tagPattern})(\\s[^>]*)?>([\\s\\S]*?)<\\/\\1>`,
                    "i"
                );
                const match = re.exec(src);
                if (match) {
                    return {
                        type: "customTag",
                        raw: match[0],
                        tag: match[1],
                        attrs: match[2] || "",
                        tokens: this.lexer.inlineTokens(match[3]),
                    };
                }
            },
            renderer(token) {
                const inner = this.parser.parseInline(token.tokens);
                return `<${token.tag}${token.attrs}>${inner}</${token.tag}>`;
            },
        }],
    });
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

    //markedInstance.use(MarkedKatex(options),{
     //   renderer:createShikiRender()
    //})
    markedInstance.use(MarkedKatex(options));
    markedInstance.use({ renderer: createShikiRender() });
    registerCustomTags(markedInstance);
    console.log("Markdow + Shiki Engine Ready");
    //registerCustomTags(markedInstance);
    
}
const exposed = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="10" y1="14" x2="3" y2="21" />
            </svg>`;
const hiden = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
            </svg>`;


function expandView(el) {
    const wrapper = el.closest(".code-block-wrapper");
    if (!wrapper) return;

    wrapper.classList.toggle("code-expanded");
    const isExpanded = wrapper.classList.contains("code-expanded");
    el.classList.toggle("expand");
    
    el.innerHTML = isExpanded ? exposed : hiden; 
      // frame stays, picture changes
    
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
                            <div class="copy-expand-btn" onclick="expandView(this)" id="expand">
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
export function renderMarkdownDepricated(markdownText) { //depricated
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

    // Parse as usual — marked leaves raw <table>...</table> intact
    let html = markedInstance.parse(cleanText);

    // Find each <table> in the result and swap it for a sandboxed iframe
    html = html.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => {
        try {
            if (!tableHtml || typeof tableHtml !== 'string') return tableHtml; // failover

            const doc = `<!doctype html><html><head><meta charset="utf-8">
                <style>
                    body{margin:0;font:14px system-ui;padding:8px;background:#0d1117;color:#e6edf3}
                    table{border-collapse:collapse;width:100%}
                    th,td{border:1px solid #30363d;padding:6px 10px;text-align:left}
                    th{background:#161b22}
                </style></head><body>${tableHtml}</body></html>`;

            const encoded = doc.replace(/"/g, '&quot;');

            return `<iframe sandbox="allow-same-origin"
                            style="width:100%;border:1px solid #30363d;border-radius:6px;min-height:140px"
                            srcdoc="${encoded}"></iframe>`;
        } catch (err) {
            // Failover: leave the original table untouched if anything goes wrong
            console.warn('table→iframe conversion failed, keeping raw table', err);
            return tableHtml;
        }
    });

    return html;
}
