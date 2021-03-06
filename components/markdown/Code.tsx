interface CodeProps {
  language: string;
  children: string;
}

const Code: React.FC<CodeProps> = ({ language, children }) => {
  return (
    <pre style={{ borderRadius: 4, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 4, right: 8, color: 'lightslategray' }}>{language}</div>
      <code
        style={{ backgroundColor: '#f6f8fa' }}
        className={`hljs language-${language}`}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </pre>
  );
};

export default Code;
