import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Loader2, CheckCircle, XCircle, Users } from "lucide-react";

interface User {
  _id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: string;
  lastLogin: string;
}

const Admin = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (!isLoaded || !user) return;

      try {
        // Check if user is admin
        const response = await fetch(`http://localhost:3001/api/users/${user.id}`);

        if (response.ok) {
          const dbUser = await response.json();

          if (!dbUser.isAdmin) {
            navigate('/dashboard');
            return;
          }

          // Fetch all users
          fetchUsers();
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminAndFetchUsers();
  }, [user, isLoaded, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users');

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdatingUserId(userId);

      const response = await fetch(`http://localhost:3001/api/users/${userId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isApproved: !currentStatus,
        }),
      });

      if (response.ok) {
        // Refresh users list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user approval:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Shield className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage merchant accounts</p>
            </div>
          </motion.div>

          {/* Styled User Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300" />

            {/* Button Container */}
            <div className="relative bg-background/60 backdrop-blur-xl rounded-full p-1 border border-white/20 shadow-lg">
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl",
                    userButtonPopoverActionButton: "hover:bg-gray-100 text-gray-900 transition-colors",
                    userButtonPopoverActionButtonText: "text-gray-900 font-medium",
                    userButtonPopoverActionButtonIcon: "text-primary",
                    userButtonPopoverFooter: "hidden",
                    userPreviewMainIdentifier: "text-gray-900 font-semibold",
                    userPreviewSecondaryIdentifier: "text-gray-600",
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Total Merchants</p>
                <p className="text-3xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-foreground">
                  {users.filter(u => u.isApproved).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-foreground">
                  {users.filter(u => !u.isApproved).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Merchants Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
        >
          <div className="bg-gradient-primary p-6">
            <h2 className="text-2xl font-bold text-primary-foreground">Merchants</h2>
            <p className="text-primary-foreground/80">Manage merchant access and approvals</p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-purple-300 font-semibold">Name</TableHead>
                  <TableHead className="text-purple-300 font-semibold">Email</TableHead>
                  <TableHead className="text-purple-300 font-semibold">Role</TableHead>
                  <TableHead className="text-purple-300 font-semibold">Status</TableHead>
                  <TableHead className="text-purple-300 font-semibold">Registered</TableHead>
                  <TableHead className="text-purple-300 font-semibold">Last Login</TableHead>
                  <TableHead className="text-purple-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((merchant) => (
                  <TableRow key={merchant._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-foreground font-medium">
                      {merchant.firstName} {merchant.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{merchant.email}</TableCell>
                    <TableCell>
                      {merchant.isAdmin ? (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Merchant
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {merchant.isApproved ? (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {merchant.lastLogin
                        ? new Date(merchant.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {!merchant.isAdmin && (
                        <Button
                          variant={merchant.isApproved ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleApproval(merchant._id, merchant.isApproved)}
                          disabled={updatingUserId === merchant._id}
                          className={merchant.isApproved ? "" : "bg-green-600 hover:bg-green-700"}
                        >
                          {updatingUserId === merchant._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : merchant.isApproved ? (
                            'Revoke'
                          ) : (
                            'Approve'
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No merchants registered yet
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
