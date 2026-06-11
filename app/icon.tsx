import { ImageResponse } from 'next/server';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Placeholder lettermark in the site's teal accent color.
// Swap for the real MIXD logo asset when one is available.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d9488',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
