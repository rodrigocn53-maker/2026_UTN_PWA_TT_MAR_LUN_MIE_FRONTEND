import React from 'react';

/**
 * Componente de Avatar centralizado para toda la aplicación.
 * @param {Object} user - Objeto del usuario (debe contener name o username, e idealmente avatar_url)
 * @param {string} size - Tamaño del avatar (px)
 * @param {string} borderRadius - Radio del borde (por defecto 4px para estilo Slack)
 */
const Avatar = ({ user, size = '32px', borderRadius = '4px', style = {} }) => {
    const name = user?.name || user?.username || 'U';
    const initial = name.charAt(0).toUpperCase();
    
    // Si en el futuro el usuario tiene avatar_url, lo usaremos aquí
    if (user?.avatar_url) {
        return (
            <img 
                src={user.avatar_url} 
                alt={name} 
                style={{ 
                    width: size, 
                    height: size, 
                    borderRadius, 
                    objectFit: 'cover',
                    ...style 
                }} 
            />
        );
    }

    // Por defecto, mostrar la inicial con el color de acento o uno consistente
    return (
        <div style={{ 
            width: size, 
            height: size, 
            background: 'var(--accent-color)', 
            color: 'white', 
            borderRadius, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontWeight: 'bold',
            fontSize: `calc(${size} / 2.2)`,
            flexShrink: 0,
            ...style 
        }}>
            {initial}
        </div>
    );
};

export default Avatar;
