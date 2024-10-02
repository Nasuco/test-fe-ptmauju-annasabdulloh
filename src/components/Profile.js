import React, { useEffect, useState } from 'react';
// Mengimpor hook dan komponen yang diperlukan dari React dan Ant Design
import { useNavigate } from 'react-router-dom';
import { Button, Card, Spin, Typography, Result, Row, Col, Space } from 'antd';

const { Title, Paragraph } = Typography; // Mengambil elemen Typography dari Ant Design

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token'); // Mengambil token dari localStorage
  const loggedInEmail = localStorage.getItem('email'); // Mengambil email pengguna yang sedang login

  useEffect(() => {
    if (!token) {
      navigate('/'); // Jika tidak ada token, arahkan ke halaman login
    } else {
      const fetchProfile = async () => {
        try {
          // Mengambil data profil pengguna dari API
          const response = await fetch(`https://reqres.in/api/users`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Mengirim token dalam header
            },
          });

          const data = await response.json(); // Mengonversi respon menjadi JSON

          if (response.ok) {
            // Jika respon berhasil, cari profil pengguna berdasarkan email
            const userProfile = data.data.find(user => user.email === loggedInEmail);

            if (userProfile) {
              setProfileData(userProfile); // Menyimpan data profil pengguna
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

  const handleLogout = () => {
    localStorage.removeItem('token'); // Menghapus dari localStorage
    localStorage.removeItem('email');
    navigate('/');
  };

  // Menampilkan loading spinner saat data sedang dimuat
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Error"
        subTitle={error}
      />
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card
          title={`User Profile #${profileData.id}`}
          bordered={false}
          style={{
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
          headStyle={{ backgroundColor: '#007bff', color: 'white', borderRadius: '10px 10px 0 0' }}
          bodyStyle={{ padding: '20px 30px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={profileData.avatar || 'https://via.placeholder.com/150'}
              alt={profileData.first_name}
              style={{
                borderRadius: '50%',
                marginBottom: '20px',
                width: '150px',
                height: '150px',
              }}
            />
            <Title level={4}>{profileData.first_name} {profileData.last_name}</Title>
            <Paragraph style={{ marginBottom: '10px' }}>{profileData.email}</Paragraph>
          </div>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button type="primary" block onClick={handleLogout}>
              Logout
            </Button>
            <Button type="default" block>
              Edit Profile
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
