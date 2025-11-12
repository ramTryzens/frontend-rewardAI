import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncAndCheckUser = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);

        // Sync user with backend
        console.log('Syncing user with backend...', {
          clerkUserId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
        });

        const syncResponse = await fetch('http://localhost:3001/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkUserId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          }),
        });

        if (!syncResponse.ok) {
          const errorData = await syncResponse.json().catch(() => ({}));
          console.error('Sync failed:', errorData);
          throw new Error(errorData.error || 'Failed to sync user with database');
        }

        console.log('User synced successfully');

        // Get user data
        const getUserResponse = await fetch(`http://localhost:3001/api/users/${user.id}`);

        if (!getUserResponse.ok) {
          throw new Error('Failed to get user data');
        }

        const dbUser = await getUserResponse.json();
        setUserData(dbUser);

        // Route based on user status
        if (dbUser.isAdmin) {
          navigate('/admin');
        } else if (dbUser.isApproved) {
          navigate('/merchant-onboarding');
        } else {
          // User is not approved yet
          setError('Your account is pending approval. Please wait for admin approval.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    syncAndCheckUser();
  }, [user, isLoaded, navigate]);

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Account Pending Approval
              </h2>
              <p className="text-muted-foreground mb-2">
                {error}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                You will receive an email once your account has been approved by an administrator.
              </p>
            </div>

            {userData && (
              <div className="bg-white/5 rounded-lg p-4 text-left">
                <h3 className="text-sm font-semibold text-foreground mb-2">Your Account Details:</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Name: {userData.firstName} {userData.lastName}</p>
                  <p>Email: {userData.email}</p>
                  <p>Status: Pending Approval</p>
                  <p>Registered: {new Date(userData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
