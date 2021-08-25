import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import ReactDOMServer from 'react-dom/server';
import Code from './markdown/Code';

const renderer: Partial<marked.Renderer> = {
  code(code, lang) {
    const language = hljs.getLanguage(lang || 'plaintext') ? lang || 'plaintext' : 'plaintext';
    const highlightResult = hljs.highlight(code, { language: language as string }).value;
    const jsx = <Code language={language}>{highlightResult}</Code>;
    return ReactDOMServer.renderToString(jsx);
  },
};

marked.use({ renderer });

export default function Markdown({ children }: { children: string }) {
  const content = marked(children);
  return <article dangerouslySetInnerHTML={{ __html: content }} />;
}
