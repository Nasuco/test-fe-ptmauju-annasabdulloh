import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Registrasi = () => {
  const [size, setSize] = useState('large');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    const { fullName, email, password } = values;

    setLoading(true);
    setError('');

    const registerData = {
      name: fullName,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('https://reqres.in/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration Success! ID: ' + data.id);
      } else {
        setError(data.error || 'Registration failed!');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="left-side">
        <h1 className="title">GoFinance</h1>
        <p className="subtitle">Lorem ipsum dolor sit amet</p>
        <Button className='read-more' type="primary" shape="round" size={size}>
          Read More
        </Button>
      </div>
      <div className="right-side">
        <Space direction="vertical" size="middle" className="register-form">
          <h2 className="heading">Hello!</h2>
          <p className="subheading">Sign Up to Get Started</p>
          <Form
            name="normal_register"
            className="register-form"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Please input your Full Name!' }]}
            >
              <Input
                className="custom-rounded-input"
                prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'gray' }} />}
                placeholder="Full Name"
              />
            </Form.Item>
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
                className="register-button" 
                type="primary" 
                htmlType="submit" 
                shape="round" 
                size={size}
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>
            {error && <p className="error-message">{error}</p>}
            <p className="login-link">
              Already have an account? <a href="/">Log in now!</a>
            </p>
          </Form>
        </Space>
      </div>
    </div>
  );
};

export default Registrasi;
