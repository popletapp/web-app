import React from 'react';

const IMAGE_SIZES = {
    'tiny': 16,
    'small': 32,
    'medium': 48,
    'large': 64,
    'massive': 128
}

export default ({ url, userId, alt, size }) => {
    if (size) {
        size = IMAGE_SIZES[size] || 32; // Default to 32
    } else {
        size = 32;
    }
    return (
        <img className='avatar' src={url || 'https://www.polytec.com.au/img/products/960-960/white.jpg'} alt={alt || 'Avatar'} width={`${size}`} height={`${size}`}></img>
    );
}