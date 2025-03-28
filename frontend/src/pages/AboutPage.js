import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  EmojiObjects as EmojiObjectsIcon,
  Public as PublicIcon,
  Nature as EcoIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Team member card component
const TeamMemberCard = ({ name, role, image, bio }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
    <CardMedia
      component="img"
      height="240"
      image={image || `https://via.placeholder.com/300x240?text=${name}`}
      alt={name}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        {name}
      </Typography>
      <Typography variant="subtitle1" color="primary" gutterBottom>
        {role}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {bio}
      </Typography>
    </CardContent>
  </Card>
);

const AboutPage = () => {
  // Team members data - update with your actual team information
  const teamMembers = [
    {
      name: 'Your Name',
      role: 'Founder & Developer',
      image: '',
      bio: 'EcoSwap was created to promote sustainability through a practical item-swapping platform. Update this with your personal information and vision for the project.'
    },
    {
      name: 'Team Member',
      role: 'Developer',
      image: '',
      bio: 'Add information about your development team member here, including their skills, experience, and contributions to the EcoSwap platform.'
    },
    {
      name: 'Team Member',
      role: 'Designer',
      image: '',
      bio: 'Add information about your design team member here, including their design philosophy, experience, and contributions to the EcoSwap user interface.'
    },
    {
      name: 'Team Member',
      role: 'Marketing',
      image: '',
      bio: 'Add information about your marketing team member here, including their strategies for growing the EcoSwap community and promoting sustainable swapping.'
    }
  ];

  // Values data
  const values = [
    {
      icon: <EcoIcon fontSize="large" color="primary" />,
      title: 'Sustainability',
      description: 'We believe in reducing waste and minimizing our environmental footprint through reuse and sharing.'
    },
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: 'Community',
      description: 'We foster connections between people, building stronger communities through sharing and collaboration.'
    },
    {
      icon: <EmojiObjectsIcon fontSize="large" color="primary" />,
      title: 'Innovation',
      description: 'We continuously improve our platform to make sustainable choices easier and more accessible for everyone.'
    },
    {
      icon: <PublicIcon fontSize="large" color="primary" />,
      title: 'Global Impact',
      description: 'We think globally while acting locally, creating solutions that can scale to make a worldwide difference.'
    }
  ];

  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: { xs: 0, sm: 2 },
          mt: 2,
          boxShadow: 1
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="primary"
            gutterBottom
            fontWeight="bold"
          >
            About EcoSwap
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Our mission is to create a more sustainable future by enabling people to swap
            instead of shop, reducing waste and building community connections.
          </Typography>
        </Container>
      </Box>

      {/* Our Story section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" color="primary" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              EcoSwap is a sustainable item swapping platform designed to make a real environmental impact. Inspired by sharing economy and circular economy principles, this platform enables people to easily swap items they no longer need for things they want.
            </Typography>
            <Typography variant="body1" paragraph>
              Our platform connects users, facilitates swaps that save money, and significantly reduces environmental impact by keeping usable items out of landfills.
            </Typography>
            <Typography variant="body1">
              EcoSwap makes it easier for everyone to participate in the circular economy and contribute to a more sustainable future through practical, everyday actions.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/about-story.jpg"
              alt="EcoSwap story"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
                height: 'auto'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Our Values section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" color="primary" gutterBottom>
            Our Values
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            The principles that guide everything we do at EcoSwap.
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {values.map((value, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Box sx={{ mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h5" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Environmental Impact section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/environmental-impact.jpg"
              alt="Environmental impact"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
                height: 'auto'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" color="primary" gutterBottom>
              Potential Environmental Impact
            </Typography>
            <Typography variant="body1" paragraph>
              At EcoSwap, we're committed to measuring and maximizing positive environmental impact. As our platform grows, every swap will represent resources saved, emissions avoided, and waste diverted from landfills.
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Track CO2 emissions avoided"
                  secondary="See your environmental impact grow with each swap"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Start swapping items today"
                  secondary="Each swap keeps items out of landfills"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Join our growing community"
                  secondary="Be among the first conscious consumers on our platform"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Save money through swapping"
                  secondary="Keep money in your pocket while reducing consumption"
                />
              </ListItem>
            </List>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/register"
              sx={{ mt: 2 }}
            >
              Join Our Movement
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Meet the Team section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" color="primary" gutterBottom>
            Meet Our Team
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            The passionate people behind EcoSwap.
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {teamMembers.map((member, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <TeamMemberCard
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  bio={member.bio}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Us section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" color="primary" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Have questions or suggestions? We'd love to hear from you!
          </Typography>
          <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Get in Touch
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                  <Typography variant="body1" paragraph>
                    support@westlacomputerexpert.tech
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Phone
                  </Typography>
                  <Typography variant="body1" paragraph>
                    +1 (310) 850 8093
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    2829 Greenfield Ave
                  </Typography>
                  <Typography variant="body1" paragraph>
                    LA CA 90064
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Join Us section */}
      <Container sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/images/join-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2
          }}
        >
          <Typography variant="h3" color="primary" gutterBottom>
            Join the EcoSwap Community
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Be part of the solution. Start swapping today and help us build a more sustainable future.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ mt: 2 }}
          >
            Sign Up Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;