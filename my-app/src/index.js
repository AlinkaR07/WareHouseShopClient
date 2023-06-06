/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useState, useEffect} from 'react'
import './index.css'
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import 'antd/dist/reset.css';
import { Button, Carousel, Typography, Image} from 'antd';
import { ErrorBoundary } from "react-error-boundary";

/**
 * импорт созданных компонентов 
 */
import Order from './components/orders/Order'
import Write from './components/writes/Write'
import Tovar from './components/tovars/Tovar'
import OrderCreate from './components/orders/orderCreate/orderCreate'
import WriteCreate from './components/writes/writeCreate/writeCreate'
import TovarCreate from './components/tovars/tovarCreate/tovarCreate';
import Layout from "./components/Layout/Layout"
import LogIn from "./components/LogIn/LogIn"
import Register from './components/Layout/Register/Register'
import LogOff from './components/Layout/Logoff/Logoff'
import IntUser from './components/Layout/InfUser/IntUser'
import LineOrder from './components/orders/LinesOrder';
import LineWrite from './components/writes/LinesWrite';
//import Im1 from './components/image/warehouse1.jpg'
//import Im2 from './components/image/warehouse2.jpg'
//import Im3 from './components/image/warehouse3.jpg'
//import Im4 from './components/image/warehouse4.avif'



const {Title} = Typography;

const contentStyle = {
  height: '500px',
  color: '#fff',
  lineHeight: '250px',
  textAlign: 'center',
  background: '#364d79',
};

/**
 *  определение компонента App
 * @returns 
 */
const App = () => {

  const [orders, setOrders] = useState([])// Состояние заказов, начальное значение - пустой массив
  const[writes, setWrites] = useState([])// Состояние актов списания, начальное значение - пустой массив
  const[tovars, setTovars] = useState([])// Состояние товаров, начальное значение - пустой массив
  const [lineorders, setLineOrders] = useState([]) // Состояние строк заказов, начальное значение - пустой массив
  const [linewrites, setLineWrites] = useState([]) // Состояние строк актов списания, начальное значение - пустой массив
  const addOrder = (order) => setOrders([...orders, order]) // функция создания заказа
  const addWrite = (write) => setWrites([...writes, write]) // функция создания акта списания
  const addTovar = (tovar) => setTovars([...tovars, tovar]) // функция создания товара
  const addLineOrder = (lineorder) => setLineOrders([...lineorders, lineorder]) // функция создания строки заказа
  const addLineWrite = (linewrite) => setLineWrites([...linewrites, linewrite]) // функция создания строки акта списания
  const removeOrder = (removeNumber) => setOrders(orders.filter(({ number }) => number !== removeNumber)); //функция удаления заказа
  const removeWrite = (removeNumber) => setOrders(orders.filter(({ numberAct }) => numberAct !== removeNumber)); //функция удаления акта списания
  const removeTovar = (removeNumber) => setTovars(tovars.filter(({ codTovara }) => codTovara !== removeNumber)); //функция удаления товара
  const removeLineOrder = (removeNumber) => setLineOrders(orders.filter(({ number }) => number !== removeNumber)); //функция удаления строки заказа
  const removeLineWrite = (removeNumber) => setLineOrders(orders.filter(({ number }) => number !== removeNumber)); //функция удаления строки акта списани
  const [user, setUser] = useState({ isAuthenticated: false, userName: "", userRole: "" }) // объект неавторизованного пользователя

    /**
   * Хук изменений, сслыающийся на состояние функционального компонента
   */
  useEffect(() => {
    const getUser = async () => {
      return await fetch("api/account/isauthenticated")
        .then((response) => {
          response.status === 401 &&
            setUser({ isAuthenticated: false, userName: "", userRole:"" })
          return response.json()
        })
        .then(
          (data) => {
            if (
              typeof data !== "undefined" &&
              typeof data.userName !== "undefined" &&
              typeof data.userRole !== "undefined"
            ) {
              setUser({ isAuthenticated: true, userName: data.userName, userRole: data.userRole })
            }
          },
          (error) => {
            console.log(error)
          }
        )
    }
    getUser()
  }, [setUser])

   // возвращение компонента
  return (
    <ErrorBoundary>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout user={user}/>}>
      <Route index element={<div>
      <Title style={{textAlign: "center"}} level={2}>Наши будни</Title>
        <Carousel autoplay width="50%">
        <div>
        <Image width={1500} height={700} /*src={}*/></Image>
        </div>
        <div>
        <Image width={1500} height={700} /*src={}*/></Image>
        </div>
        <div>
        <Image width={1500} height={700} /*src={}*/></Image>
        </div>
        <div>
        <Image width={1500} height={700} /*src={}*/></Image>
        </div>
      </Carousel></div>
    } />
      <Route path="/Orders/" element={
    <div id="2">
      <Order user={user}
        orders={orders}
        setOrders={setOrders}
        setLineOrders={setLineOrders}
        removeOrder={removeOrder}
      />
      <OrderCreate user={user} addOrder={addOrder} addLineOrder={addLineOrder}/>
    </div>
}
/>
<Route path="/Writes/" element={
    <div id="2">
      <Write user={user}
        writes={writes}
        setWrites={setWrites}
        setLineWrites={setLineWrites}
        removeWrite={removeWrite}
      />
      <WriteCreate user={user} addWrite={addWrite} addLineWrite={addLineWrite}/>
    </div>
}
/>
<Route path="/Tovar/" element={
    <div id="3">
      <Tovar user={user}
        tovars={tovars}
        setTovars={setTovars}
        removeTovar={removeTovar}
      />
    <TovarCreate user={user} addTovar={addTovar} setTovars={setTovars}/>
    </div>
}
/>
    <Route path="/login"
element={<LogIn user={user} setUser={setUser} />}
/>
<Route path="/register"
element={<Register user={user} setUser={setUser} />}
/>
<Route path="/logoff"
element={<LogOff user={user} setUser={setUser} />}
/>
<Route path="/infuser"
element={<IntUser user={user} setUser={setUser} />}
/>
<Route path="/LinesOrder/"
element={<LineOrder user={user} setUser={setUser}  lineorder={lineorders} setLineOrders={setLineOrders} removeLineOrder={removeLineOrder}/>}
/>
<Route path="/LinesWrite/"
element={<LineWrite user={user} setUser={setUser}  linewrite={linewrites} setLineWrites={setLineWrites} removeLineWrite={removeLineWrite}/>}
/>
     <Route path="*" element={<h3>404</h3>} />
    </Route>
    </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)