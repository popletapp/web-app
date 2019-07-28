import React from 'react';
import './Avatar.scss';

const IMAGE_SIZES = {
  tiny: 16,
  small: 32,
  medium: 48,
  large: 64,
  massive: 128
};

export default ({ url, alt, size }) => {
  const originalSize = size;
  if (size) {
    size = IMAGE_SIZES[size] || 32; // Default to 32
  } else {
    size = 32;
  }

  if (!url && alt) {
    return <div className={`avatar avatar-${originalSize || 'massive'}`} style={{ width: size, height: size }}><p>{alt.slice(0, 1)}</p></div>;
  }

  return (
    <img className={`avatar avatar-${originalSize || 'massive'}`} src={url || 'https://www.polytec.com.au/img/products/960-960/white.jpg'} alt={alt || 'Avatar'} style={{ width: size, height: size }}></img>
  );
};
