/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ContainerOutlined,
  UserOutlined,
  ExportOutlined,
  HomeOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SkypeOutlined,
  WhatsAppOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Button, Avatar, Image, Row, Col, icon , Typography} from 'antd';
import {  Outlet, Link } from "react-router-dom"
import React, { useState } from 'react';
import Item from 'antd/es/list/Item';
import { ErrorBoundary } from "react-error-boundary";
//import ImLogo from "../image/logo.png"

const { Header, Sider, Content, Footer } = Layout;
const {Title} = Typography;

   /**
   * Содержимое для верхнего меню 
   */
const items1 = [
  {
    label: <Link to={"/"}>Главная страница</Link>,
    key: "0",
  },
  {
    label: <Link to={"/login"}>Вход</Link>,
    key: "1",
  },
  {
    label: <Link to={"/register"}>Регистрация</Link>,
    key: "2",
  },
]

   /**
   * Содержимое для бокового меню
   */
const items2 = [
  {
    label: <Link to={"/"}>Главная страница</Link>,
    icon: <HomeOutlined />,
    key: "0",
  },
  {
    label: <Link to={"/infuser"}>Пользователь</Link>,
    icon: <UserOutlined />,
    key: "4",
  },
  {
    label: <Link to={"/Orders/"}>Заказы</Link>,
    icon: <ContainerOutlined />,
    key: "5",
  },
  {
    label: <Link to={"/Writes/"}>Акты списания</Link>,
    icon: <ContainerOutlined />,
    key: "6",
  },
  {
    label: <Link to={"/Tovar/"}>Товары</Link>,
    icon: <ShoppingOutlined />,
    key: "7",
  }
]

   /**
   * Содержимое для бокового меню для Гостя
   */
const items3 = [
  {
    label: <Link to={"/"}>Главная страница</Link>,
    icon: <HomeOutlined />,
    key: "0",
  }
]

/**
   * определение компонента LayoutView
   * @param {*} user - компонент-пользователь
 * @returns 
 */
const LayoutView = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

    // возвращение компонента
  return (
    <ErrorBoundary>
      {user.isAuthenticated ? ( 
    <Layout style={{ background: "#00474f"}}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{background: "#002329", color: "white"}}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger', width: 25, height: 25,
            onClick: () => setCollapsed(!collapsed),
          })} 
          <Menu 
          style={{background: "#002329", color: "white"}}
          //theme="dark"
          mode="inline"
          items={items2}
        />
          </Sider>
          <Layout>
      <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%", background: "#00474f" }}>
        <div
          style={{
            float: "right",
            color: "rgba(255, 255, 255, 0.65)",
          }}
        >
          {user.isAuthenticated ? (
         <div><Avatar size="large" icon={<UserOutlined />}/> <strong color='white'>Пользователь: { user.userName}</strong>  <a href='/logoff'><Button icon={<ExportOutlined />} name="logoff" type="link">Выйти</Button></a></div>) : (

          <strong>Гость</strong>
        )}
       
        </div>
          </Header>
          <Content className="site-layout" style={{ padding: "0 50px" }}>
        <Outlet />
      </Content>
      <p></p>
      <Footer style={{color: "white", background: "#00474f" }}>
          <div>
            <Row type="flex" justify="space-around" align="middle">
              <Col style={{ textAlign: "center"}} span={24}><Title style={{color: "white"}} level={3}>Контакты</Title></Col>
            </Row>
          <Row type="flex" justify="space-around" align="middle">
              <Col span={7} offset={2}>
              <Title style={{color: "white"}} level={4}>О НАС</Title>
              <h3><EnvironmentOutlined /> Адрес: г.Иваново, ул.Рабфаковская, д.34</h3>
              <h3><PhoneOutlined /> Номер телефона: 8(996)918-07-79</h3>
              <h3><MailOutlined /> E-mail: romanovaalina2003@gmail.com</h3></Col>
              <Col span={7}>
              <Title style={{color: "white"}} level={4}>МЫ В СОЦСЕТЯХ И МЕСЕНДЖЕРАХ</Title>
              <a href='https://vk.com/alinaromanowa'><Button style={{color: "white"}} icon={<StarOutlined />} name="vk" type="link">Вконтакте</Button></a><br/>
              <a href=''><Button style={{color: "white"}} icon={<WhatsAppOutlined />} name="vk" type="link">WhatsApp: 8(996)918-07-79</Button></a><br/>
              <a href='https://join.skype.com/invite/d7flddfU7IqS'><Button style={{color: "white"}} icon={<SkypeOutlined />} name="vk" type="link">Skype</Button></a>
              </Col>
              <Col span={7}><Image width={150} height={100} src={ImLogo}/></Col>
          </Row>
          </div>
        </Footer>
        <Footer style={{ textAlign: "center", color: "white", background: "#00474f" }}>WareHouseShop ©2023</Footer>
      </Layout>
      </Layout> 
      
      ) : ( 

        <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{background: "#002329", color: "white"}}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger', width: 25, height: 25,
              onClick: () => setCollapsed(!collapsed),
            })} 
            <Menu 
          //theme="dark"
          mode="inline"
          style={{background: "#00474f", color: "white"}}
          items={items3}
        />
            </Sider>
            <Layout>
        <Header style={{ position: "sticky", top: 0, zIndex: 1, width: "100%", background: "#00474f" }}>
          <div
            style={{
              float: "right",
              color: "rgba(255, 255, 255, 0.65)",
            }}
          >
            {user.isAuthenticated ? (
           <div background="#006d75"><Avatar size="large" icon={<UserOutlined />}/> <strong>Пользователь: { user.userName}</strong>  <a href='/logoff'><Button style={{color: "#13c2c2"}} icon={<ExportOutlined />} name="logoff" type="link">Выйти</Button></a></div>) : (
  
            <strong>Гость</strong>
          )}
         
          </div>
          <Menu style={{background: "#00474f", color: "white"}} mode="horizontal" defaultSelectedKeys={['0']} items={items1} className="menu" />
            </Header>
            <Content className="site-layout" style={{ padding: "0 50px"}}>
          <Outlet />
        </Content>
        <p></p>
        <Footer style={{color: "white", background: "#00474f" }}>
          <div>
            <Row type="flex" justify="space-around" align="middle">
              <Col style={{ textAlign: "center"}} span={24}><Title style={{color: "white"}} level={3}>Контакты</Title></Col>
            </Row>
          <Row type="flex" justify="space-around" align="middle">
              <Col span={7} offset={2}>
              <Title style={{color: "white"}} level={4}>О НАС</Title>
              <h3><EnvironmentOutlined /> Адрес: г.Иваново, ул.Рабфаковская, д.34</h3>
              <h3><PhoneOutlined /> Номер телефона: 8(996)918-07-79</h3>
              <h3><MailOutlined /> E-mail: romanovaalina2003@gmail.com</h3></Col>
              <Col span={7}>
              <Title style={{color: "white"}} level={4}>МЫ В СОЦСЕТЯХ И МЕСЕНДЖЕРАХ</Title>
              <a href='https://vk.com/alinaromanowa'><Button style={{color: "white"}} icon={<StarOutlined />} name="vk" type="link">Вконтакте</Button></a><br/>
              <a href=''><Button style={{color: "white"}} icon={<WhatsAppOutlined />} name="vk" type="link">WhatsApp: 8(996)918-07-79</Button></a><br/>
              <a href='https://join.skype.com/invite/d7flddfU7IqS'><Button style={{color: "white"}} icon={<SkypeOutlined />} name="vk" type="link">Skype</Button></a>
              </Col>
              <Col span={7}><Image width={150} height={100} /*src={ImLogo}*//></Col>
          </Row>
          </div>
        </Footer>
        <Footer style={{ textAlign: "center", color: "white", background: "#00474f" }}>WareHouseShop ©2023</Footer>
        </Layout>
        </Layout>
           )} 
      </ErrorBoundary>
  )
}

/**
  *  экспорт компонента LayoutView
  */
export default LayoutView
