interface LayoutProps {
  children: React.ReactNode;
}

const LeftHeader: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <div className="content">{children}</div>
  </div>
);

export default LeftHeader;
