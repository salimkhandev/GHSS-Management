import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    Grid,
    Chip,
    IconButton,
    Button,
    Divider,
    Avatar
} from '@mui/material';
import {
    Code as CodeIcon,
    Email as EmailIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    School as SchoolIcon,
    Storage as DatabaseIcon,
    Web as WebIcon,
    PhoneIphone as MobileIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const skills = [
    { category: 'Frontend', icon: <WebIcon />, items: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Angular.js'] },
    { category: 'Backend', icon: <DatabaseIcon />, items: ['Node.js', 'Redis'] },
    { category: 'Database', icon: <DatabaseIcon />, items: ['MongoDB', 'PostgreSQL'] },
    { category: 'Core & Tools', icon: <CodeIcon />, items: ['Docker', 'PWA'] }
];

const DeveloperPortfolio = () => {
    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(180deg, var(--color-surface), var(--color-surface-raised))',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                }}>
                    {/* Header Banner */}
                    <Box sx={{
                        background: 'var(--gradient-primary)',
                        height: { xs: '120px', sm: '160px' },
                        position: 'relative'
                    }} />

                    <CardContent sx={{ px: { xs: 3, sm: 5 }, pb: { xs: 4, sm: 5 } }}>
                        {/* Avatar & Title Area */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: { xs: -8, sm: -10 },
                            mb: 4
                        }}>
                            <Avatar
                                src="/image.webp"
                                sx={{
                                    width: { xs: 120, sm: 150 },
                                    height: { xs: 120, sm: 150 },
                                    border: '4px solid white',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    bgcolor: '#1A237E', // deep blue to contrast with gradient
                                    mb: 2,
                                }}
                            />
                            
                            <Typography variant="h3" sx={{ 
                                fontWeight: 800, 
                                fontFamily: '"Playfair Display", serif',
                                color: 'var(--color-primary)',
                                textAlign: 'center',
                                mb: 1,
                                fontSize: { xs: '2rem', sm: '2.5rem' }
                            }}>
                                Salim Khan
                            </Typography>
                            
                            <Typography variant="h6" sx={{ 
                                color: 'var(--color-text-secondary)',
                                fontWeight: 500,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <CodeIcon color="primary" />
                                Full Stack Developer
                            </Typography>

                            <Chip 
                                icon={<SchoolIcon />} 
                                label="BS Software Engineering" 
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 600, fontSize: '0.9rem', py: 2 }}
                            />
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Bio Section */}
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-primary)' }}>
                                About Me
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: 'var(--color-text-primary)', 
                                lineHeight: 1.8,
                                fontSize: '1.05rem',
                                textAlign: 'justify'
                            }}>
                                Hi, I'm Salim Khan, a professional Full Stack Developer with expertise in building scalable, modern web applications. 
                                I am passionate about creating seamless user experiences and robust backend architectures. This school management application 
                                is a testament to my skills in utilizing modern JavaScript frameworks, crafting responsive UI components, and implementing secure APIs.
                            </Typography>
                        </Box>

                        {/* Skills Section */}
                        <Box sx={{ mb: 5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-primary)' }}>
                                Technical Expertise
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 1 }}>
                                {skills.map((skillGroup, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 0.5, sm: 2 } }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--color-primary)', minWidth: '120px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {skillGroup.icon}
                                            {skillGroup.category}:
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>
                                            {skillGroup.items.join(', ')}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Social/Contact Links */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-primary)' }}>
                                Let's Connect
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<EmailIcon />}
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=salimkhandev@gmail.com"
                                    target="_blank"
                                    sx={{
                                        background: 'linear-gradient(45deg, #d44638, #f05e4f)',
                                        color: 'white',
                                        px: 3, py: 1.5,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 12px rgba(212, 70, 56, 0.3)',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(212, 70, 56, 0.4)' }
                                    }}
                                >
                                    Email Me
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<GitHubIcon />}
                                    href="https://github.com/salimkhandev"
                                    target="_blank"
                                    sx={{
                                        background: 'linear-gradient(45deg, #24292e, #3f4448)',
                                        color: 'white',
                                        px: 3, py: 1.5,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 12px rgba(36, 41, 46, 0.3)',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(36, 41, 46, 0.4)' }
                                    }}
                                >
                                    GitHub
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<LinkedInIcon />}
                                    href="https://www.linkedin.com/in/salimkhandev"
                                    target="_blank"
                                    sx={{
                                        background: 'linear-gradient(45deg, #0077b5, #00a0dc)',
                                        color: 'white',
                                        px: 3, py: 1.5,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(0, 119, 181, 0.4)' }
                                    }}
                                >
                                    LinkedIn
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default DeveloperPortfolio;
