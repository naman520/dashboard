'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedClient({ children }: Props) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        //await axios.get('http://localhost:5000/api/protected/validate-dashboard-access', {
        await axios.get('https://dash-backend-vxau.onrender.com/api/protected/validate-dashboard-access', {
          withCredentials: true,
        });
        setAuthorized(true);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else if (err.response?.status === 403) {
          alert(err.response.data.error); // warning or blocked
          router.push('/');
        }
        setAuthorized(false);
      }
    };

    checkAccess();
  }, [router]);

  if (authorized === null) return <div>Checking access...</div>;
  if (!authorized) return null;

  return <>{children}</>;
}
