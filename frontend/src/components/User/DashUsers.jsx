import { Modal, Table, Button, TextInput, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
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
    doc.text('User Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Add filter information
    doc.setFontSize(12);
    doc.text(`Filter: ${adminFilter === 'all' ? 'All Users' : adminFilter === 'admin' ? 'Admins Only' : 'Regular Users'}`, 14, 35);
    if (searchTerm) {
      doc.text(`Search Term: ${searchTerm}`, 14, 42);
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
    doc.save('user-report.pdf');
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {loading && <div className="text-center mb-4">Loading...</div>}
      {currentUser?.rest?.isAdmin && users.length > 0 ? (
        <>
          <div className="flex gap-4 mb-4">
            <TextInput
              type="text"
              placeholder="Search users by username, email, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="user">Regular Users</option>
            </Select>
            <Button
              onClick={generatePDF}
              className="flex items-center gap-2"
              color="gray"
            >
              <FaFilePdf className="w-5 h-5" />
              Export PDF
            </Button>
          </div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {filteredUsers.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && !loading && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
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
