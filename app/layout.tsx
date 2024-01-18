import type { Metadata } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar/Navbar';
import Wagmi from '@/components/Wagmi';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'OctaSwap',
  description: '#1 AMM. Staking. Farming',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('font-roboto antialiased', poppins.variable, roboto.variable, 'scrollbar-hide')}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          <Wagmi>
            <Navbar />
            {children}
          </Wagmi>
        </ThemeProvider>
      </body>
    </html>
  );
}
