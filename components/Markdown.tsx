import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export default function Markdown({ children }: { children: string }) {
  const content = marked(children, {
    langPrefix: 'hljs language-',
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  });
  return <article dangerouslySetInnerHTML={{ __html: content }} />;
}
