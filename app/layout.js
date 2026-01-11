import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from "./providers";
import CyberNotch from './components/CyberNotch'; // Import the notch

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FUTO Cyber Defenders',
  description: 'Elite Cyber Operations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden"> 
      <body className={`${inter.className} bg-cyber-black overflow-x-hidden w-screen`}>
        <Providers>
          {/* THE NOTCH NAV */}
          <CyberNotch />
          
          {children}
        </Providers>
      </body>
    </html>
  )
}