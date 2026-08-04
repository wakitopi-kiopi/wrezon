import { Theme } from '@shikijs/vscode-textmate';
import {marked, Marked} from 'marked';
import {createHighlighter} from 'shiki';
import MarkedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css';

let highlighter = null;
let markedInstance = null;


const options = {throwOnError: false}


export async function initMarkdownRendered() {
    if (markedInstance) return;

    highlighter = await createHighlighter({
        themes:['github-dark'],
        langs:['python','javascript','html','css','json','bash','sql','cpp']
    })
    
    markedInstance = new Marked()

    markedInstance.use(MarkedKatex(options),{
        renderer:createShikiRender()
    })
    console.log("Markdow + Shiki Engine Ready");
    
}



function createShikiRender(){
    return{
        code({text,lang}){
            const loadedLangs = highlighter.getLoadedLanguages();
            const validLang = (lang && loadedLangs.includes(lang.toLowerCase()))
            ? lang.toLowerCase()
            : 'txt';

            const highlightedHtml = highlighter.codeToHtml(text || '',{
                lang:validLang,
                theme:'github-dark'
            })

            return `
                <div class="code-block-wrapper">
                    <div class="code-header">
                        <span class="code-lang">${validLang}</span>
                    </div>
                    ${highlightedHtml}
                </div> 
                `;
        }
    }
}

export function renderMarkdown(markdownText){
    if (!markedInstance){
        console.warn("Render called before initialization complete");
        return markdownText;
    }
    return markedInstance.parse(markdownText)
}