
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import { Logo } from '../components/ui/Logo';
import { Monogram } from '../components/ui/Monogram';
import { Footer } from '../components/layout/Footer';

const SPECIALTIES = [
  'Registered Nurse',
  'Emergency Medicine',
  'Anesthesiology',
  'Pediatrics',
  'Family Medicine',
  'Radiology',
  'Surgical Tech',
  'ICU / Critical Care',
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: { xs: 26, md: 30 },
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ color: '#8896A6', fontSize: 14 }}>{label}</Typography>
    </Box>
  );
}

function HowStep({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '18px',
        p: 3,
        boxShadow: '0 1px 2px rgba(30,50,80,0.06)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            bgcolor: '#EDF2F9',
            color: '#1D3461',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 28,
            color: '#E2E8F0',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {n}
        </Typography>
      </Box>
      <Typography sx={{ fontWeight: 750, fontSize: 18, mt: 2 }}>{title}</Typography>
      <Typography sx={{ color: '#556A82', fontSize: '0.9063rem', lineHeight: 1.5, mt: 0.9 }}>
        {body}
      </Typography>
    </Box>
  );
}

export default function HomePage() {
  return (
    <Box>
      {/* ──── Landing top bar ──── */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          height: 70,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'saturate(1.4) blur(12px)',
          borderBottom: '1px solid',
          borderColor: '#EDF2F9',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            gap: 2.5,
            px: { xs: 2.25, md: 3.5 },
          }}
        >
          <Logo size={26} />
          <Box
            component="nav"
            sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2.25 }}
          >
            {['For professionals', 'For clinics', 'How it works'].map((label) => (
              <Typography
                key={label}
                component="span"
                sx={{
                  px: 1.75,
                  py: 1.1,
                  borderRadius: 999,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  cursor: 'pointer',
                  transition: 'all 0.14s',
                  '&:hover': { bgcolor: '#F6F8FB', color: 'text.primary' },
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#E2E8F0',
              color: 'text.primary',
              '&:hover': { borderColor: '#A0AEC0', bgcolor: '#F6F8FB' },
            }}
          >
            Sign in
          </Button>
          <Button
            component={Link}
            href="/jobs"
            variant="contained"
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Get started
          </Button>
        </Container>
      </Box>

      {/* ──── Hero ──── */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 5, md: 8 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background:
              'radial-gradient(120% 90% at 88% -10%, #D8E4F0 0%, transparent 55%), radial-gradient(90% 80% at 50% 120%, #EDF2F9 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            gap: { xs: 4, md: 7 },
            alignItems: 'center',
            px: { xs: 2.25, md: 3.5 },
          }}
        >
          {/* Copy */}
          <Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff',
                border: '1px solid',
                borderColor: 'divider',
                color: '#1D3461',
                fontSize: '0.8438rem',
                fontWeight: 650,
                px: 1.75,
                py: 0.9,
                borderRadius: 999,
                boxShadow: '0 1px 2px rgba(30,50,80,0.06)',
              }}
            >
              <VerifiedUserRoundedIcon sx={{ fontSize: 16 }} />
              Trusted by 2,400+ verified clinics
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 38, sm: 48, md: 'clamp(38px, 4.6vw, 60px)' },
                mt: 2.75,
                maxWidth: '14ch',
              }}
            >
              The marketplace where healthcare finds its people.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 16, md: 'clamp(16px, 1.6vw, 19px)' },
                lineHeight: 1.55,
                color: 'text.secondary',
                mt: 2.5,
                maxWidth: '46ch',
              }}
            >
              Medboard connects doctors, nurses, and specialists with clinics
              and hospitals that need them — verified, transparent, and built
              for medicine.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3.75, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/jobs"
                variant="contained"
                size="large"
                startIcon={<SearchRoundedIcon />}
              >
                Find a job
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PeopleOutlineRoundedIcon />}
                sx={{
                  borderColor: '#E2E8F0',
                  color: 'text.primary',
                  '&:hover': { borderColor: '#A0AEC0', bgcolor: '#F6F8FB' },
                }}
              >
                Hire staff
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: 3.25 },
                mt: 5,
              }}
            >
              <Stat value="18k+" label="Open vacancies" />
              <Divider orientation="vertical" flexItem sx={{ height: 38, alignSelf: 'center' }} />
              <Stat value="46k+" label="Verified pros" />
              <Divider orientation="vertical" flexItem sx={{ height: 38, alignSelf: 'center' }} />
              <Stat value="48 hr" label="Avg. time to hire" />
            </Box>
          </Box>

          {/* Visual */}
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 300, md: 380 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Deep blue blob */}
            <Box
              sx={{
                position: 'absolute',
                inset: '6% 2%',
                borderRadius: '40px',
                background: 'linear-gradient(150deg, #2B4C7E, #1D3461)',
                boxShadow: '0 12px 40px rgba(27,52,97,0.25)',
                transform: 'rotate(-3deg)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '40px',
                  opacity: 0.5,
                  background: 'radial-gradient(80% 60% at 20% 10%, rgba(255,255,255,0.18), transparent 60%)',
                },
              }}
            />
            {/* Floating job card */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                width: { xs: '80%', md: 330 },
                bgcolor: '#fff',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 2px rgba(30,50,80,0.06)',
                p: 2.25,
                transform: 'rotate(-1.5deg)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Monogram name="Beacon Hill Medical Center" size={46} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 750, fontSize: 16 }}>
                    ICU Registered Nurse
                  </Typography>
                  <Typography sx={{ color: '#8896A6', fontSize: 13 }}>
                    Beacon Hill Medical Center
                  </Typography>
                </Box>
                <Box
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 650,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: '8px',
                    bgcolor: '#FBE9E7',
                    color: '#C45C3A',
                    flexShrink: 0,
                  }}
                >
                  Urgent
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.9, flexWrap: 'wrap', mt: 1.75 }}>
                {['Boston, MA', 'Full-time', 'Night'].map((t) => (
                  <Box
                    key={t}
                    sx={{
                      fontSize: '0.78rem',
                      fontWeight: 650,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: '8px',
                      bgcolor: '#F6F8FB',
                      border: '1px solid #EDF2F9',
                      color: '#556A82',
                    }}
                  >
                    {t}
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  mt: 1.75,
                }}
              >
                <Box>
                  <Typography sx={{ color: '#8896A6', fontSize: 12 }}>Salary</Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 19,
                      color: '#1D3461',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    $96k–$124k
                    <Typography component="span" sx={{ fontSize: 12, fontWeight: 600, color: '#8896A6' }}>
                      /yr
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Floating candidate mini-card */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                zIndex: 3,
                right: '-2%',
                bottom: '6%',
                width: 230,
                bgcolor: '#fff',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 2px rgba(30,50,80,0.06)',
                p: 2,
                transform: 'rotate(3deg)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: '#EDF2F9',
                    color: '#2B4C7E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  JW
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 750, fontSize: 15 }}>
                    James Whitfield
                  </Typography>
                  <Typography sx={{ color: '#8896A6', fontSize: 12.5 }}>
                    Critical Care RN · BSN
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 1.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.9,
                  bgcolor: '#E8F5E9',
                  color: '#2E7D32',
                  fontWeight: 700,
                  fontSize: 13,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 999,
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2E8B57' }} />
                Available now
              </Box>
            </Box>
            {/* Floating verified pill */}
            <Box
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                position: 'absolute',
                zIndex: 4,
                top: '8%',
                left: '-2%',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff',
                border: '1px solid #E2E8F0',
                color: '#2E8B57',
                fontWeight: 700,
                fontSize: '0.8438rem',
                px: 1.75,
                py: 1.1,
                borderRadius: 999,
                boxShadow: '0 2px 6px rgba(30,50,80,0.06), 0 8px 24px rgba(30,50,80,0.06)',
              }}
            >
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />
              <Typography component="span" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.8438rem' }}>
                License verified
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ──── Trust strip ──── */}
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4.5,
          py: 3.25,
          flexWrap: 'wrap',
          borderTop: '1px solid #EDF2F9',
          mt: 3,
          px: { xs: 2.25, md: 3.5 },
        }}
      >
        <Typography sx={{ color: '#8896A6', fontSize: 13, fontWeight: 600 }}>
          Hiring across leading health systems
        </Typography>
        <Box sx={{ display: 'flex', gap: 3.75, flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            'Beacon Hill Medical',
            'Riverside Children\'s',
            'Summit Cardiology',
            'Harbor View Health',
            'Lakeside Surgical',
          ].map((c) => (
            <Box
              key={c}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                opacity: 0.7,
              }}
            >
              <Monogram name={c} size={30} radius={9} />
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{c}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ──── Dual paths ──── */}
      <Container
        maxWidth="xl"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.75,
          pt: 7,
          pb: 1,
          px: { xs: 2.25, md: 3.5 },
        }}
      >
        <Box
          component={Link}
          href="/jobs"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: '26px',
            p: 4,
            border: '1px solid #E2E8F0',
            background: 'linear-gradient(180deg, #fff, #EDF2F9)',
            cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 40px rgba(27,52,97,0.12), 0 2px 8px rgba(27,52,97,0.06)',
              borderColor: '#D8E4F0',
            },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: '#2B4C7E',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(30,50,80,0.15)',
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography variant="h4" sx={{ fontSize: 23, mt: 2.5 }}>
            For healthcare professionals
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.97rem', lineHeight: 1.55, mt: 1.25, maxWidth: '42ch' }}>
            Browse vetted vacancies with transparent pay, set your availability,
            and let the right clinics come to you.
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.9,
              mt: 2.5,
              fontWeight: 700,
              color: '#1D3461',
              fontSize: '0.9375rem',
            }}
          >
            Find a job <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: '26px',
            p: 4,
            border: '1px solid #E2E8F0',
            background: 'linear-gradient(180deg, #fff, #F6F8FB)',
            cursor: 'pointer',
            transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 12px 40px rgba(27,52,97,0.12), 0 2px 8px rgba(27,52,97,0.06)',
              borderColor: '#D8E4F0',
            },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: '#2B4C7E',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(30,50,80,0.15)',
            }}
          >
            <BusinessRoundedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography variant="h4" sx={{ fontSize: 23, mt: 2.5 }}>
            For clinics &amp; hospitals
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.97rem', lineHeight: 1.55, mt: 1.25, maxWidth: '42ch' }}>
            Search a pool of credential-verified professionals by specialty,
            experience, and real-time availability.
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.9,
              mt: 2.5,
              fontWeight: 700,
              color: '#1D3461',
              fontSize: '0.9375rem',
            }}
          >
            Hire staff <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      </Container>

      {/* ──── How it works ──── */}
      <Container maxWidth="xl" sx={{ pt: 9.5, px: { xs: 2.25, md: 3.5 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 26, md: 'clamp(26px, 3vw, 36px)' } }}>
            From search to signed in days, not months
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 16, mt: 1.5 }}>
            A single workflow that respects how clinical hiring actually works.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2.5,
            mt: 4.75,
          }}
        >
          <HowStep
            n="01"
            icon={<PersonOutlineRoundedIcon sx={{ fontSize: 24 }} />}
            title="Build a verified profile"
            body="Add your license, certifications, and availability. We verify credentials so clinics trust what they see."
          />
          <HowStep
            n="02"
            icon={<SearchRoundedIcon sx={{ fontSize: 24 }} />}
            title="Match on what matters"
            body="Filter by specialty, shift, location, and pay. Real numbers up front — no recruiter run-around."
          />
          <HowStep
            n="03"
            icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 24 }} />}
            title="Connect and get hired"
            body="Message directly, schedule interviews, and accept offers — all inside one secure place."
          />
        </Box>
      </Container>

      {/* ──── Specialties ──── */}
      <Container maxWidth="xl" sx={{ pt: 9.5, px: { xs: 2.25, md: 3.5 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 26, md: 'clamp(26px, 3vw, 36px)' } }}>
            Explore roles by specialty
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
            mt: 4,
          }}
        >
          {SPECIALTIES.map((s) => (
            <Box
              key={s}
              component={Link}
              href={`/jobs?specialization=${encodeURIComponent(s)}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.25,
                bgcolor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                px: 2.25,
                py: 2,
                fontWeight: 650,
                fontSize: '0.9375rem',
                color: 'text.primary',
                textDecoration: 'none',
                transition: 'all 0.14s',
                '&:hover': {
                  borderColor: '#2B4C7E',
                  bgcolor: '#EDF2F9',
                  color: '#1D3461',
                },
              }}
            >
              <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
                {s}
              </Typography>
              <Typography
                component="span"
                sx={{ color: '#8896A6', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}
              >
                {120 + ((s.length * 37) % 900)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ──── CTA band ──── */}
      <Container maxWidth="xl" sx={{ px: { xs: 2.25, md: 3.5 } }}>
        <Box
          sx={{
            mt: 10,
            borderRadius: '26px',
            px: { xs: 4.25, md: 6.5 },
            py: { xs: 4.25, md: 6 },
            background: 'linear-gradient(135deg, #2B4C7E, #142543)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3.75,
            flexWrap: 'wrap',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -60,
              top: -60,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: 28, color: '#fff' }}
            >
              Ready when you are.
            </Typography>
            <Typography sx={{ color: 'rgba(200,215,235,0.85)', fontSize: 16, maxWidth: 460 }}>
              Join thousands of clinicians and clinics already hiring on Medboard.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/jobs"
              size="large"
              sx={{
                bgcolor: '#fff',
                color: '#1D3461',
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              Find a job
            </Button>
            <Button
              size="large"
              sx={{
                bgcolor: 'rgba(255,255,255,0.14)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
              }}
            >
              Hire staff
            </Button>
          </Box>
        </Box>
      </Container>

      {/* ──── Footer ──── */}
      <Footer />
    </Box>
  );

}

