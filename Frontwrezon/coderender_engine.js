import { Theme } from '@shikijs/vscode-textmate';
import {marked, Marked} from 'marked';
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki';
import MarkedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css';

let highlighter = null;
let markedInstance = null;


const options = {throwOnError: false}


export async function initMarkdownRendered() {
    if (markedInstance) return;

    highlighter = await createHighlighter({
        engine: createJavaScriptRegexEngine(),
        themes:['github-dark'],
        langs:['python','javascript','html','css','json','bash','sql','cpp']
    })
    
    markedInstance = new Marked()

    markedInstance.use(MarkedKatex(options),{
        renderer:createShikiRender()
    })
    console.log("Markdow + Shiki Engine Ready");
    
}

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

                return `
                    <div class="code-block-wrapper">
                        <div class="code-header">
                            <span class="code-lang">${language}</span>
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

export function renderMarkdown(markdownText){
    if (!markedInstance){
        console.warn("Render called before initialization complete");
        return markdownText;
    }
    const htmlResult = markedInstance.parse(markdownText);
    console.log("HTML RESULT FROM MARKED:", htmlResult);
    return markedInstance.parse(markdownText)
}