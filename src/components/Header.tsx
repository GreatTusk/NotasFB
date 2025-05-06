import { FileText } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <FileText className="h-8 w-8" />
          <h1 className="text-2xl font-bold">NoteVault</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
