import React from 'react';
import Poplet from './../../../';
import './Avatar.scss';

const IMAGE_SIZES = {
  tiny: 16,
  small: 32,
  medium: 48,
  large: 64,
  massive: 128
};

export default ({ id, url, alt, size, className, onClick }) => {
  const originalSize = size;
  if (size) {
    size = IMAGE_SIZES[size] || 32; // Default to 32
  } else {
    size = 32;
  }
  const properties = {
    onClick
  }

  if (!url && alt) {
    return <div 
    {...properties}
    className={`avatar avatar-${originalSize || 'small'} ${className}`} 
    style={{ width: size, height: size }}><p>{alt.slice(0, 1)}</p></div>;
  }

  return (
    <img 
    {...properties}
    className={`avatar avatar-${originalSize || 'small'} ${className}`} 
    src={id && url ? `${Poplet.API.API_DOMAIN}/avatars/${id}/${url}`
      : 'https://www.polytec.com.au/img/products/960-960/white.jpg'} alt={alt || 'Avatar'} style={{ width: size, height: size }}></img>
  );
};
