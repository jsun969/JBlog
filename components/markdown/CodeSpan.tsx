interface CodeSpanProps {
  children: string;
}

const CodeSpan: React.FC<CodeSpanProps> = ({ children }) => {
  return (
    <code style={{ padding: '.2em .4em', marginInline: 2, fontSize: '85%', backgroundColor: '#eff1f3', borderRadius: 6 }}>
      {children}
    </code>
  );
};

export default CodeSpan;
