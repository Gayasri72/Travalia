import React, { useState, useEffect } from 'react';
import { Table, Tabs, message, Spin, Popconfirm, Button, Input } from 'antd';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Search } = Input;

const customStyles = `
  .custom-tabs .ant-tabs-nav {
    margin-bottom: 24px;
  }
  
  .custom-tabs .ant-table {
    margin: 0 auto;
    max-width: 1200px;
  }
  
  .custom-tabs .ant-table-thead > tr > th {
    text-align: center;
    background-color: #f8fafc;
    font-weight: 600;
  }
  
  .custom-tabs .ant-table-tbody > tr > td {
    text-align: center;
  }
  
  .custom-tabs .ant-tabs-tab {
    font-weight: 500;
  }
  
  .custom-tabs .ant-tabs-tab-active {
    font-weight: 600;
  }
  
  .custom-tabs .ant-table-pagination {
    margin: 16px 0;
    text-align: center;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

const HireData = () => {
  const [pickupData, setPickupData] = useState([]);
  const [dropData, setDropData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pickupSearchText, setPickupSearchText] = useState('');
  const [dropSearchText, setDropSearchText] = useState('');

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

  const filteredPickupData = pickupData.filter(item =>
    item?.name?.toLowerCase().includes(pickupSearchText.toLowerCase())
  );

  const filteredDropData = dropData.filter(item =>
    item?.name?.toLowerCase().includes(dropSearchText.toLowerCase())
  );

  const handleExportPickupPDF = () => {
    const doc = new jsPDF();
    doc.text('Pickup Data', 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [[
        'ID',
        'Pickup Location',
        'Drop Location',
        'Date',
        'Name',
        'Email',
        'Phone',
        'Vehicle',
      ]],
      body: filteredPickupData.map(item => [
        item._id,
        item.pickupLocation,
        item.dropLocation,
        new Date(item.date).toLocaleDateString(),
        item.name,
        item.email,
        item.phone,
        item.vehicle?.name || '',
      ]),
    });
    doc.save('pickup_data.pdf');
  };

  const handleExportDropPDF = () => {
    const doc = new jsPDF();
    doc.text('Drop Data', 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [[
        'ID',
        'Pickup Location',
        'Drop Location',
        'Date',
        'Name',
        'Email',
        'Phone',
        'Vehicle',
      ]],
      body: filteredDropData.map(item => [
        item._id,
        item.pickupLocation,
        item.dropLocation,
        new Date(item.date).toLocaleDateString(),
        item.name,
        item.email,
        item.phone,
        item.vehicle?.name || '',
      ]),
    });
    doc.save('drop_data.pdf');
  };

  const items = [
    {
      key: '1',
      label: 'Pickup Data',
      children: (
        <div>
          <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Search
              placeholder="Search by name"
              allowClear
              onChange={e => setPickupSearchText(e.target.value)}
              style={{ width: 300 }}
              className="mb-4"
            />
            <Button type="primary" onClick={handleExportPickupPDF} style={{ marginLeft: 16 }}>
              Export to PDF
            </Button>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <Table
            columns={pickupColumns}
            dataSource={filteredPickupData}
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
          <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Search
              placeholder="Search by name"
              allowClear
              onChange={e => setDropSearchText(e.target.value)}
              style={{ width: 300 }}
              className="mb-4"
            />
            <Button type="primary" onClick={handleExportDropPDF} style={{ marginLeft: 16 }}>
              Export to PDF
            </Button>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <Table
            columns={dropColumns}
            dataSource={filteredDropData}
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Hire Data Management</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <Tabs 
            defaultActiveKey="1" 
            items={items}
            className="custom-tabs"
            tabBarStyle={{ marginBottom: '24px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HireData;
