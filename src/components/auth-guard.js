import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/');
    } else {
      setLoading(false); 
    }
  }, []);

  // Return loading indicator or null while checking token
  if (loading) {
    return <p>Loading...</p>; 
  }

  return children; 
};

export default AuthGuard;
