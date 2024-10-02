import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Input, Button, Table, Row, Col, Drawer, Typography, Divider, Tag, Card, Descriptions, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Transaction = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([
    { item: "Lorem Ipsum Dolor Si...", price: "1000000", date: "12/04/2023", status: "Completed", id: 1 },
    { item: "Sed Do Eiusmod Tempor...", price: "2000000", date: "12/01/2023", status: "Pending", id: 2 },
  ]);

  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [newTransaction, setNewTransaction] = useState({ item: '', price: '', date: '', status: 'Pending' });
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  const token = localStorage.getItem('token');
  const loggedInEmail = localStorage.getItem('email');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`https://reqres.in/api/users`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            const userProfile = data.data.find(user => user.email === loggedInEmail);

            if (userProfile) {
              setProfileData(userProfile);
              setIsLoggedIn(true);
            } else {
              setError('Profile not found for the logged-in user.');
            }
          } else {
            setError('Failed to fetch profile data.');
          }
        } catch (error) {
          setError('Something went wrong while fetching profile data.');
        }

        setLoading(false);
      };

      fetchProfile();
    }
  }, [token, navigate, loggedInEmail]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this transaction?',
      onOk: () => {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
      },
    });
  };

  const showDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedTransaction(null);
  };

  const showEditModal = (transaction) => {
    setEditedTransaction(transaction);
    setEditVisible(true);
  };

  const handleEdit = () => {
    setTransactions(transactions.map(transaction =>
      transaction.id === editedTransaction.id ? editedTransaction : transaction
    ));
    setFilteredTransactions(filteredTransactions.map(transaction =>
      transaction.id === editedTransaction.id ? editedTransaction : transaction
    ));
    setEditVisible(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAddModal = () => {
    setAddVisible(true);
  };

  const handleAdd = () => {
    const newId = transactions.length ? Math.max(transactions.map(t => t.id)) + 1 : 1;
    const addedTransaction = { ...newTransaction, id: newId };
    setTransactions([...transactions, { ...newTransaction, id: newId }]);
    setFilteredTransactions([...filteredTransactions, addedTransaction]);
    setNewTransaction({ item: '', price: '', date: '', status: 'Pending' });
    setAddVisible(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const showMobileDrawer = () => {
    setMobileDrawerVisible(true);
  };

  const onCloseMobileDrawer = () => {
    setMobileDrawerVisible(false);
  };

  const columns = [
    {
      title: <input type="checkbox" />,
      dataIndex: 'checkbox',
      render: (_, record) => <input type="checkbox" />,
    },
    {
      title: 'Item',
      dataIndex: 'item',
      width: '30%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '20%',
      render: (price) => `Rp. ${Number(price).toLocaleString('id-ID')}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '20%',
      render: (status) => <span className={status === "Completed" ? "status-completed" : "status-pending"}>{status}</span>,
    },
    {
      title: 'Action',
      width: '10%',
      render: (text, transaction) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(transaction)} />
          <Button icon={<EyeOutlined />} onClick={() => showDetails(transaction)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(transaction.id)} />
        </>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = transactions.filter((transaction) =>
      transaction.item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}><Title level={3}>Loading...</Title></div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={3}>Error</Title>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      <h2>List Transaction</h2>
      <Row gutter={16} justify="space-between" align="middle">
        <Col xs={24} sm={16}>
          <Input.Search
              placeholder="Search Transaction"
              className="search-input"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              enterButton
              allowClear
              size="large"
              prefix={<SearchOutlined />}
            />
        </Col>
        <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            size="large"
            style={{
              marginTop: '16px',
              marginBottom: '16px',
              width: '100%',
              minWidth: '160px',
              maxWidth: '200px',
            }}
          >
            Add Transaction
          </Button>
        </Col>
      </Row>

      <Drawer
        title="Transaction Details"
        placement="right"
        onClose={onCloseMobileDrawer}
        visible={mobileDrawerVisible}
      >
        {selectedTransaction && (
          <div>
            <p><strong>Item:</strong> {selectedTransaction.item}</p>
            <p><strong>Price:</strong> {`Rp. ${Number(selectedTransaction.price).toLocaleString('id-ID')}`}</p>
            <p><strong>Date:</strong> {selectedTransaction.date}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
          </div>
        )}
      </Drawer>

      <Table
        dataSource={filteredTransactions}
        columns={columns}
        rowKey="id"
        scroll={{ x: 768 }}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <p><strong>Item:</strong> {record.item}</p>
              <p><strong>Price:</strong> {`Rp. ${Number(record.price).toLocaleString('id-ID')}`}</p>
              <p><strong>Date:</strong> {record.date}</p>
              <p><strong>Status:</strong> {record.status}</p>
              <Row justify="space-around" style={{ marginTop: '16px' }}>
                <Col>
                  <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                </Col>
                <Col>
                  <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Col>
              </Row>
            </div>
          ),
          expandIconColumnIndex: -1,
        }}
      />

      <Modal
        visible={visible}
        onCancel={handleClose}
        footer={null}
        width={500}
      >
        {selectedTransaction && (
          <Card bordered={false}>
            <Title level={4} style={{ textAlign: 'center', marginBottom: '16px' }}>
              Transaction Details
            </Title>
            <Descriptions bordered column={1} size="small" labelStyle={{ fontWeight: 'bold' }}>
              <Descriptions.Item label="Item">{selectedTransaction.item}</Descriptions.Item>
              <Descriptions.Item label="Price">
                <Text type="success">{`Rp. ${Number(selectedTransaction.price).toLocaleString('id-ID')}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(selectedTransaction.date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedTransaction.status === 'Completed' ? 'green' : 'red'}>
                  {selectedTransaction.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>


      <Modal
        title="Edit Transaction"
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditVisible(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>Save</Button>,
        ]}
      >
        {editedTransaction && (
          <div>
            <label>Item:</label>
            <Input
              name="item"
              value={editedTransaction.item}
              onChange={handleEditChange}
            />
            <label>Price:</label>
            <Input
              name="price"
              type="number"
              value={editedTransaction.price ? editedTransaction.price.toString() : ''}
              onChange={handleEditChange}
            />
            <label>Date:</label>
            <Input
              name="date"
              type="date"
              value={editedTransaction.date ? new Date(editedTransaction.date).toISOString().split('T')[0] : ''}
              onChange={handleEditChange}
            />
            <label>Status:</label>
            <Select
              name="status"
              value={editedTransaction.status}
              onChange={(value) => handleEditChange({ target: { name: 'status', value } })}
              style={{ marginTop: '16px', width: '200px' }}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </div>
        )}

      </Modal>

      <Modal
        title="Add New Transaction"
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddVisible(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleAdd}>Add</Button>,
        ]}
      >
        <div>
          <label>Item:</label>
          <Input 
            name="item"
            placeholder='Enter item name'
            value={newTransaction.item} 
            onChange={handleAddChange} 
            style={{ marginBottom: '16px' }}
          />
          
          <label>Price:</label>
          <Input 
            name="price"
            placeholder='Enter price'
            type="number"
            value={newTransaction.price}
            onChange={handleAddChange}
            style={{ marginBottom: '16px' }}
          />
          
          <label>Date:</label>
          <DatePicker 
            name="date"
            value={newTransaction.date ? dayjs(newTransaction.date) : null}
            onChange={(date, dateString) => handleAddChange({ target: { name: 'date', value: dateString } })} 
            style={{ width: '100%', marginBottom: '16px' }}
          />
          
          <label>Status:</label>
          <Select
            name="status"
            value={newTransaction.status}
            onChange={(value) => handleAddChange({ target: { name: 'status', value } })}
            style={{ width: '100%', marginTop: '16px' }}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Cancelled">Cancelled</Select.Option>
          </Select>
        </div>
      </Modal>

    </div>
  );
};

export default Transaction;
