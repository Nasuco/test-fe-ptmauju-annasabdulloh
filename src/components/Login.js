import React, { useEffect, useState } from 'react';
// Mengimpor komponen dari Ant Design dan React Router untuk membangun tampilan login
import { Button, Form, Input, Space } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [size, setSize] = useState('large');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Memeriksa token di localStorage
    if (token) {
      navigate('/profile');  // Jika token ada, diarahkan ke halaman profil
    }

    const fetchUsers = async () => {
      const response = await fetch('https://reqres.in/api/users'); // Mengambil data pengguna dari API
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data); // Menyimpan data pengguna ke state jika berhasil
      }
    };

    fetchUsers(); // Memanggil fungsi untuk mengambil data pengguna
  }, [navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    const loginData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Mengirim data login sebagai JSON
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', values.email);

        const loggedInUser = users.find(user => user.email === values.email); // Mencari pengguna yang login
        
        if (loggedInUser) {
          localStorage.setItem('first_name', loggedInUser.first_name);
          localStorage.setItem('last_name', loggedInUser.last_name);
        }

        navigate('/profile');
      } else {
        setError(data.error || 'Login failed!');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <h1 className="title">GoFinance</h1>
        <p className="subtitle">Lorem ipsum dolor sit amet</p>
        <Button className='read-more' type="primary" shape="round" size={size}>
          Read More
        </Button>
      </div>
      <div className="right-side">
        <Space direction="vertical" size="middle" className="login-form">
          <h2 className="heading">Hello Again!</h2>
          <p className="subheading">Welcome Back</p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                className="custom-rounded-input"
                prefix={<MailOutlined className="site-form-item-icon" style={{ color: 'gray' }} />}
                placeholder="Email Address"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                className="custom-rounded-input"
                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'gray' }} />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                className="login-button" 
                type="primary" 
                htmlType="submit" 
                shape="round" 
                size={size}
                loading={loading}
              >
                Log In
              </Button>
            </Form.Item>
            <p className="forgot-password">
              <a href="/forgot">Forgot Password?</a>
            </p>
            <p className="register-link">
              Don't have an account? <a href="/register">Register now!</a>
            </p>
          </Form>
          {error && <p className="error-message">{error}</p>}
        </Space>
      </div>
    </div>
  );
};

export default Login;
