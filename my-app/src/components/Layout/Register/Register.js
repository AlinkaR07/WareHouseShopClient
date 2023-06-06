/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Form, Input, Modal, message } from 'antd';
import Logoff from "../Logoff/Logoff";
import { ErrorBoundary } from "react-error-boundary";

/**
 * определение компонента Register
 * @param {*} user - компонент-пользователь
 * @param setUser  - функция сеттера для управления состоянием компонента user
 * @returns 
 */

const Register = ({ user, setUser }) => {
  const [open, setOpen] = useState(false)  // Состояние модального окна
  const [errorMessages, setErrorMessages] = useState([])  // Состояние сообщений об ошибках
  const navigate = useNavigate() // Хук для перенаправления на другую страницу

  /**
   * Функция открытия модального окна
   */
  const showModal = () => {
    setOpen(true);
  };

  /**
   * Функция отрисовки сообщения об ошибках
   * @returns <div key={index}>{error}</div>
   */
  const renderErrorMessage = () =>
    errorMessages.map((error, index) => <div key={index}>{error}</div>)

   /**
   * Функция закрытия модального окна(нажатие на кнопку "крестик")
   */
    const handleCancel = () => {
      console.log("Clicked cancel button")
      setOpen(false)
      navigate("/")
    }

  const [messageApi, contextHolder] = message.useMessage(); // Хук для показа уведомлений
  /**
   * Функция отображения уведомления
   */
  const info = () => {
    messageApi.success("Пользователь успешно зарегистрирован");
  };
  

  /**
   * Хук изменений, сслыающийся на состояние функционального компонента
   */
  useEffect(() => {
    showModal()
  }, [])

  /**
   * Функция регистрации
   * @param {*} formValues - значения, который вводил пользователь в компоненты формы
   * @returns 
   */
  const Register = async (formValues) => {
    console.log("Success:", formValues)

     /**
     * определение параметров запроса
     */
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
        passwordConfirm: formValues.passwordConfirm,
      }),
    }

    /**
     * отправка POST-запроса на сервер
     */
    return await fetch(
      "api/account/register",
      requestOptions
    )
      .then((response) => {
        response.status === 200 &&
          setUser({ isAuthenticated: true, userName: "", userRole: "" })  // Установить состояние пользователя
        return response.json()
      })
      .then(
        (data) => {
          console.log("Data:", data)
          // Если получены корректные данные, то установить состояние пользователя: его имя и роль и перейти на главную страницу
          if (                               
            typeof data !== "undefined" &&
            typeof data.userName !== "undefined"
          ) {
            setUser({ isAuthenticated: true, userName: data.userName, userRole: data.userRole })
            navigate("/")
          }
          typeof data !== "undefined" &&
            typeof data.error !== "undefined" &&
            setErrorMessages(data.error)   // Установить сообщения об ошибках
        },
        (error) => {
          console.log(error)
        }
      )
  }

 // возвращение компонента
  return (
    <ErrorBoundary>  {/* обработка ошибок с помощью компонента ErrorBoundary */}
    <>
    {contextHolder}  {/* Контекст для показа уведомлений */}
      {user.isAuthenticated ? (
        <Form 
        name="basic"
        labelCol={{span: 8,}}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 1200,
          margin: 30,
        }}
        autoComplete="off">
        <h3>Пользователь {user.userName} успешно зарегистрирован. Для регистрации нового пользователя нужно выйти из аккаунта.</h3></Form>) : (
        <>
        <Modal open={open} onOk={Logoff} onCancel={handleCancel} footer={[null]}>
          <h3>Регистрация</h3>
          <Form 
          onFinish={Register}
          name="basic"
          labelCol={{span: 8,}}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinishFailed={renderErrorMessage}
          autoComplete="off">
    <Form.Item label="Username" name="email" placeholder="Логин"
          rules={[
           {
             required: true,
             message: 'Please input your username!',
           },
                ]}
    >
         <Input />
    </Form.Item>
    <Form.Item label="Password" name="password" placeholder="Пароль" 
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
                 ]}
    >
      <Input.Password />
      </Form.Item>
      <Form.Item label="PasswordConfirm" name="passwordConfirm" placeholder="Пароль" 
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
                 ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
    <Button style={{background: "#08979c"}} type="primary" htmlType="submit" onClick={info}>Зарегистрироваться</Button>
    </Form.Item>
          </Form>          
      </Modal>
      {renderErrorMessage()}
    </>
  )
}
</>
</ErrorBoundary>
  )}

  /**
  *  экспорт компонента Register
  */
export default Register