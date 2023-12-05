import { useState, useEffect } from 'react';

export const useUserRole = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch('/api/userRole', {
          credentials: 'include', // to ensure cookies are sent
        });
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setRole(data.role);
        } else {
          // If the content type is not JSON, handle the scenario appropriately
          console.error('Expected JSON response, received:', contentType);
          setRole(null);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setRole(null);
      }
    };

    fetchRole();
  }, []);

  return role;
};