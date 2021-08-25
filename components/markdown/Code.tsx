export default function Code({ language, children }: { language: string; children: string }) {
  return (
    <pre style={{ borderRadius: 4, position: 'relative' }}>
      <code
        style={{ backgroundColor: '#f6f8fa' }}
        className={`hljs language-${language}`}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </pre>
  );
}
