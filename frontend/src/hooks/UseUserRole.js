import { useState, useEffect } from 'react';

export const useUserRole = () => {
  const [userData, setUserData] = useState({ position: null, username: null });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/userRole', {
          credentials: 'include',
        });
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUserData({ position: data.role, username: data.username });
        } else {
          console.error('Expected JSON response, received:', contentType);
          setUserData({ position: null, username: null });
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setUserData({ position: null, username: null });
      }
    };

    fetchRole();
  }, []);

  return userData;
};