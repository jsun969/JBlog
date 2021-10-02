import 'highlight.js/styles/github.css';
import Code from './markdown/Code';
import CodeSpan from './markdown/CodeSpan';
import MarkdownImage from './markdown/Image';
import ReactDOMServer from 'react-dom/server';
import hljs from 'highlight.js';
import marked from 'marked';

const renderer: Partial<marked.Renderer> = {
  code(code, lang) {
    const language = hljs.getLanguage(lang || 'plaintext') ? lang || 'plaintext' : 'plaintext';
    const highlightResult = hljs.highlight(code, { language }).value;
    const jsx = <Code language={language}>{highlightResult}</Code>;
    return ReactDOMServer.renderToString(jsx);
  },
  codespan(code) {
    const jsx = <CodeSpan>{code}</CodeSpan>;
    return ReactDOMServer.renderToString(jsx);
  },
  image(href, title, text) {
    const jsx = <MarkdownImage href={href} title={title} text={text} />;
    return ReactDOMServer.renderToString(jsx);
  },
};

marked.use({ renderer });

interface MarkdownProps {
  children: string;
}

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const content = marked(children);
  return <article dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Markdown;
