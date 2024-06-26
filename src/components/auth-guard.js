import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthGuard = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/');
      return;
    }

    const checkAccess = async () => {
      const role = localStorage.getItem('userRole');
      
      if (allowedRoles.includes(role)) {
        setLoading(false);
      } else {
        if (role === 'ROLE_ADMIN') {
          router.push('/adminstaff');
        } else if (role === 'ROLE_SALESTAFF') {
          router.push('/salestaff');
        } else {
          router.push('/');
        }
      }
    };

    checkAccess();
  }, [router, allowedRoles]);

  if (loading) {
    return <p></p>;
  }

  return children;
};

export default AuthGuard;
