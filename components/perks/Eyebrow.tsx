interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Eyebrow({ children, style = {} }: Props) {
  return (
    <div className="eyebrow" style={style}>
      {children}
    </div>
  );
}
