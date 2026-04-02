import { Button, Flex, Col, Divider, Image, Form, Input, Row, type FormProps } from 'antd';
import './LoginPage.css';
import WSLogo from '../../../assets/logo/WS logo.png';
import AppleLogo from '../../../assets/icon/apple-logo.png'
import GoogleLogo from '../../../assets/icon/google.png'
import FacebookLogo from '../../../assets/icon/communication.png'

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
}

export default function LoginPage() {
    return (
        <>
            <div className="login-container">
                <div className="navbar">
                    <div className="nav-left">
                        <Row>
                            <Col span={12}>
                                <span>Home</span>
                                <span>About</span>
                                <span>Blogs</span>
                                <span>Help</span>
                                <span>Contact</span>
                            </Col>
                        </Row>
                    </div>
                    <div className="nav-right">
                        <span className="language">English</span>
                        <Button className='btn-login'>Sign in</Button>
                        <Button className='btn-register'>Register</Button>
                    </div>
                </div>
                <div className="login-content">
                    <div className="login-section">
                        {/* <img src={WSLogo} alt="WS Logo" /> */}
                        <Image width={280} src={WSLogo} ></Image>
                    </div>

                    <Form
                        style={{ paddingTop: 250 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item<FieldType>
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        ><Input style={{ height: 38 }} placeholder='請輸入帳號' /></Form.Item>
                        <Form.Item<FieldType>
                            name="password"
                            rules={[{ required: true, message: 'Pleasr input your password!' }]}
                            style={{marginBottom: 0}}
                        >
                            <Input.Password style={{ height: 38 }} placeholder='請輸入密碼' />
                            
                        </Form.Item>
                        <Form.Item style={{marginBottom: 12}}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button style={{ paddingRight: 0, color: '#C7C7C7' }} color='default' variant='link'>忘密碼</Button>
                            </div>
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button style={{ width: 400, height: 45, backgroundColor: '#EE97BB' }} type='primary' htmlType='submit'>登入</Button>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Divider style={{ borderColor: '#dfdfdf', color: '#c7c7c7' }}>Or continue with</Divider>
                        </Form.Item>
                        <Form.Item>
                            <Flex wrap gap="small" style={{ justifyContent: 'space-around' }}>
                                <Button style={{ width: '31%', height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }} type='default' icon={<img src={GoogleLogo} alt="google" style={{ width: 18, margin: 0, paddingTop: 2 }} />}></Button>
                                <Button style={{ width: '31%', height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }} type='default' icon={<img src={AppleLogo} alt="google" style={{ width: 18, margin: 0, paddingTop: 2 }} />}></Button>
                                <Button style={{ width: '31%', height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }} type='default' icon={<img src={FacebookLogo} alt="google" style={{ width: 18, margin: 0, paddingTop: 2 }} />}></Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}