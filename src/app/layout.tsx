import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import Navigation from "@/components/Navigation";
import { Box, Container, Typography } from "@mui/material";
import { UserProvider } from "@/contexts/UserContext";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEO Projects Tracker",
  description: "A web app to track and manage SEO projects and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          <UserProvider>
            <Navigation>
              {children}
            </Navigation>
            <Box 
              component="footer" 
              sx={{ 
                py: 2, 
                bgcolor: 'background.paper', 
                borderTop: 1, 
                borderColor: 'divider',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 1000
              }}
            >
              <Container maxWidth={false}>
                <Typography variant="body2" color="text.secondary" align="center">
                  © {new Date().getFullYear()} SEO Projects Tracker
                </Typography>
              </Container>
            </Box>
          </UserProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
