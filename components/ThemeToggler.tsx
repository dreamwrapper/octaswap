import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import useClient from '@/hooks/useClient';

export default function ThemeToggler() {
  const isClient = useClient();
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!isClient) {
    return <Button className='invisible'></Button>;
  }

  return (
    <Button variant='ghost' size='icon' onClick={handleClick}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
