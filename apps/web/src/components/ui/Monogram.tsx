import { Box } from '@mui/material';

interface MonogramProps {
  name: string;
  size?: number;
  radius?: number;
}

export function Monogram({ name, size = 48, radius }: MonogramProps) {
  const letters = name
    .split(' ')
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: radius ? `${radius}px` : `${size * 0.26}px`,
        background: '#EDF2F9',
        color: '#1D3461',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.36,
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {letters}
    </Box>
  );
}
