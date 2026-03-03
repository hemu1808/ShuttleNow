import React from 'react';
import { ShaderGradient } from '@shadergradient/react';

interface ShaderBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <ShaderGradient
          control="props"
          color1="#ff6b6b"
          color2="#4ecdc4"
          color3="#45b7d1"
          animate="on"
          uAmplitude={3}
          uDensity={1}
          uFrequency={5.5}
          uSpeed={0.1}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default ShaderBackground;