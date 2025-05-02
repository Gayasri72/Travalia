import { Modal, Table, Button, TextInput, Select, Card, Badge, Alert, Avatar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiOutlineSearch, HiOutlineFilter, HiOutlineUserGroup, HiOutlineMail, HiOutlineCalendar, HiOutlineTrash } from 'react-icons/hi';
import { FaCheck, FaTimes, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [adminFilter, setAdminFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/users/getusers', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message || 'Failed to connect to server');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.rest?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?.rest?.isAdmin]);

  // Search and filter functionality
  useEffect(() => {
    const filtered = users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        new Date(user.createdAt).toLocaleDateString().includes(searchLower);
      
      const matchesAdminFilter = 
        adminFilter === 'all' || 
        (adminFilter === 'admin' && user.isAdmin) || 
        (adminFilter === 'user' && !user.isAdmin);

      return matchesSearch && matchesAdminFilter;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users, adminFilter]);

  const handleShowMore = async () => {
    setLoading(true);
    setError(null);
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch more users');
      }

      const data = await res.json();
      setUsers((prev) => [...prev, ...data.users]);
      if (data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      setError(error.message || 'Failed to connect to server');
      console.error('Error fetching more users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/delete/${userIdToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      setShowModal(false);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to delete user');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('User Management Report', 14, 15);
    
    // Add date and filter information
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Filter: ${adminFilter === 'all' ? 'All Users' : adminFilter === 'admin' ? 'Admins Only' : 'Regular Users'}`, 14, 32);
    if (searchTerm) {
      doc.text(`Search Term: ${searchTerm}`, 14, 39);
    }
    
    // Prepare table data
    const tableData = filteredUsers.map(user => [
      new Date(user.createdAt).toLocaleDateString(),
      user.username,
      user.email,
      user.isAdmin ? 'Yes' : 'No'
    ]);
    
    // Add table
    autoTable(doc, {
      startY: 50,
      head: [['Date Created', 'Username', 'Email', 'Admin']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold',
      },
    });
    
    // Save the PDF
    doc.save('user-management-report.pdf');
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and monitor user accounts in your system
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Search users by username, email, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={HiOutlineSearch}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              icon={HiOutlineFilter}
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="user">Regular Users</option>
            </Select>
          </div>
          <Button
            onClick={generatePDF}
            className="flex items-center gap-2"
            color="gray"
          >
            <FaFilePdf className="w-5 h-5" />
            Export PDF
          </Button>
        </div>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        )}

        {currentUser?.rest?.isAdmin && users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table hoverable className="w-full">
                <Table.Head>
                  <Table.HeadCell className="bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendar className="w-5 h-5" />
                      Date created
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineUserGroup className="w-5 h-5" />
                      User Details
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineMail className="w-5 h-5" />
                      Email
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineUserGroup className="w-5 h-5" />
                      Role
                    </div>
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineTrash className="w-5 h-5" />
                      Actions
                    </div>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filteredUsers.map((user) => (
                    <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            img={user.profilePicture}
                            alt={user.username}
                            rounded
                            size="md"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user._id}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <HiOutlineMail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{user.email}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={user.isAdmin ? "success" : "info"} size="sm">
                          {user.isAdmin ? "Admin" : "User"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className="flex items-center gap-2"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {showMore && !loading && (
              <div className="mt-4 text-center">
                <Button
                  onClick={handleShowMore}
                  color="light"
                  className="text-teal-600 hover:text-teal-700"
                >
                  Load More Users
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <HiOutlineUserGroup className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding some users to your system.
            </p>
          </div>
        )}
      </Card>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteUser}
                disabled={loading}
              >
                {loading ? 'Deleting...' : "Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
