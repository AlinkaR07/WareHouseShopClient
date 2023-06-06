/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Checkbox, Form, Input, Modal, message } from 'antd';
import { ErrorBoundary } from "react-error-boundary";

/**
 * определение компонента LogIn
 * @param {*} user - компонент-пользователь
 * @param setUser  - функция сеттера для управления состоянием компонента user
 * @returns 
 */
const LogIn = ({ user, setUser }) => {
  const [open, setOpen] = useState(false)  // Состояние модального окна
  const [errorMessages, setErrorMessages] = useState([]) // Состояние сообщений об ошибках
  const navigate = useNavigate() // Хук для перенаправления на другую страницу
  const [messageApi, contextHolder] = message.useMessage(); // Хук для показа уведомлений

  /**
   * Функция открытия модального окна
   */
  const showModal = () => {
    setOpen(true);
  };
  
  /**
   * Хук изменений, сслыающийся на состояние функционального компонента
   */
  useEffect(() => {
    showModal()
  }, [])

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

  /**
   * Функция отображения уведомления
   */
  const info = () => {
    messageApi.success("Пользователь успешно вошел в систему");
  };

  /**
   * 
   * @param {*} formValues - значения, который вводил пользователь в компоненты формы
   * @returns 
   */

  const logIn = async (formValues) => {
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
        rememberme: formValues.remember,
      }),
    }

    /**
     * отправка POST-запроса на сервер
     */
    return await fetch(
      "api/account/login",
      requestOptions
    )
      .then((response) => {
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
                    setUser({ isAuthenticated: true, userName: data.userName, userRole: data.userRole }) // Установить состояние пользователя
                  }
                },
                (error) => {
                  console.log(error)
                }
              )
          }
          getUser()

       if( response.status === 200 &&
          setUser({ isAuthenticated: true, userName: "", userRole: "" }))
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
            setUser({ isAuthenticated: true, userName: data.userName, userRole: data.userRole})
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
    {contextHolder}
      {user.isAuthenticated ? (    // если пользователь авторизован, то отобразить информацию об этом
        <Form 
        name="basic"
        labelCol={{span: 8,}}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          margin: 30,
        }}
        autoComplete="off">
        <h3>Пользователь {user.userName} успешно вошел в систему.</h3></Form>   ) : (  // если пользователь не авторизован, то открыть модальное окно авторизации
        <>
        <Modal open={open} onCancel={handleCancel} footer={[null]}>
          <h3>Вход</h3>
          <Form 
          onFinish={logIn}
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
    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8,span: 16, }}>
            <Checkbox>Remember me</Checkbox>
            {renderErrorMessage()}
    </Form.Item>
    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
    <Button style={{background: "#08979c"}} type="primary" htmlType="submit" onClick={info}>Войти</Button>
    </Form.Item>
          </Form>          
        </Modal>    
    </>
  )
}
</>
</ErrorBoundary>
  )}

/**
  *  экспорт компонента Information
  */
export default LogIn
