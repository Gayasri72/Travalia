import React, { useState, useEffect } from 'react';
import { Table, Tabs, message, Spin, Popconfirm, Button } from 'antd';
import axios from 'axios';

const HireData = () => {
  const [pickupData, setPickupData] = useState([]);
  const [dropData, setDropData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickupColumns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Pickup Location',
      dataIndex: 'pickupLocation',
      key: 'pickupLocation',
    },
    {
      title: 'Drop Location',
      dataIndex: 'dropLocation',
      key: 'dropLocation',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vehicle',
      dataIndex: ['vehicle', 'name'],
      key: 'vehicle',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this pickup booking?"
          onConfirm={() => handleDeletePickup(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>Delete</Button>
        </Popconfirm>
      ),
    }
  ];

  const dropColumns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Pickup Location',
      dataIndex: 'pickupLocation',
      key: 'pickupLocation',
    },
    {
      title: 'Drop Location',
      dataIndex: 'dropLocation',
      key: 'dropLocation',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vehicle',
      dataIndex: ['vehicle', 'name'],
      key: 'vehicle',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this drop booking?"
          onConfirm={() => handleDeleteDrop(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>Delete</Button>
        </Popconfirm>
      ),
    }
  ];

  const handleDeletePickup = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/pickup/${id}`);
      message.success('Pickup booking deleted successfully');
      fetchPickupData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting pickup booking:', error);
      message.error('Failed to delete pickup booking');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrop = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/drop/${id}`);
      message.success('Drop booking deleted successfully');
      fetchDropData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting drop booking:', error);
      message.error('Failed to delete drop booking');
    } finally {
      setLoading(false);
    }
  };

  const fetchPickupData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/pickup');
      if (response.data && response.data.data && response.data.data.pickups) {
        setPickupData(response.data.data.pickups);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching pickup data:', error);
      setError('Failed to fetch pickup data. Please make sure the backend server is running.');
      message.error('Failed to fetch pickup data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/drop');
      if (response.data && response.data.data && response.data.data.drops) {
        setDropData(response.data.data.drops);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching drop data:', error);
      setError('Failed to fetch drop data. Please make sure the backend server is running.');
      message.error('Failed to fetch drop data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupData();
    fetchDropData();
  }, []);

  const items = [
    {
      key: '1',
      label: 'Pickup Data',
      children: (
        <div>
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <Table
            columns={pickupColumns}
            dataSource={pickupData}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
            }}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Drop Data',
      children: (
        <div>
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <Table
            columns={dropColumns}
            dataSource={dropData}
            loading={loading}
            rowKey="_id"
            pagination={{
              pageSize: 10,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hire Data Management</h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default HireData;
