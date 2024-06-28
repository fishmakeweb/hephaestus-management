import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotFound from '@/app/not-found';

const AuthGuard = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      router.push('/');
      return;
    }

    if (allowedRoles.includes(role)) {
      setStatus('authorized');
    } else {
      setStatus('notFound');
    }
  }, [router, allowedRoles]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'notFound') {
    return <NotFound />;
  }

  return children;
};

export default AuthGuard;
