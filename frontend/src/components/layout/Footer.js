import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Nature as EcoIcon
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EcoIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none'
                }}
              >
                EcoSwap
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              EcoSwap is a platform where users can swap unused or lightly-used items
              instead of buying new ones, promoting sustainability and reducing waste.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="Facebook" size="small">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Twitter" size="small">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Instagram" size="small">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="LinkedIn" size="small">
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
          
          {/* Quick links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link
                component={RouterLink}
                to="/"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/items"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                Browse Items
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                Dashboard
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard/impact"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                Environmental Impact
              </Link>
            </Box>
          </Grid>
          
          {/* Contact info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Have questions or suggestions? We'd love to hear from you!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@westlacomputerexpert.tech
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 (310) 850 8093
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: 2829 Greenfield Ave LA CA 90064
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Copyright */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} EcoSwap. All rights reserved.
          </Typography>
          <Box>
            <Link
              href="#"
              color="text.secondary"
              sx={{ ml: 2 }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{ ml: 2 }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{ ml: 2 }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;