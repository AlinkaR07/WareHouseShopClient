/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Typography} from 'antd';
import { ErrorBoundary } from "react-error-boundary";

const {Text, Title} = Typography;

/**
 * определение компонента Information
 * @param {*} param0 
 * @returns компоненты страницы "Информация о пользователе"
 */
const Information = ({ user, setUser }) => {
  const [open, setOpen] = useState(false)         // Состояние страницы
  const [errorMessages, setErrorMessages] = useState([])  // Состояние сообщений об ошибках
  const navigate = useNavigate()    // Хук для перенаправления на другую страницу

  /**
   * определение асинхронной функции Information события onSubmit формы
   * @param {*} event 
   * @returns 
   */
  const Information = async (event) => {
    event.preventDefault()

    /**
     * определение параметров запроса
     */
    const requestOptions = {
      method: "GET"
    }

    /**
     * отправка GET-запроса на сервер
     */
    return await fetch(
      "api/account/isauthenticated",
      requestOptions
    )
      .then((response) => {           
        // если ответ успешный (код 200) и пользователь не авторизован, то перейти на главную страницу. Если ответ с кодом 401, то перейти на страницу входа
        response.status === 200 &&    
          setUser({ isAuthenticated: false, userName: "", userRole: "" }) 
          response.status === 401 ? navigate("/login") : navigate("/") 
          setOpen(false)  // Закрыть модальное окно
      })
  }
  
  // возвращение компонента
  return (
    <>
    <ErrorBoundary>    {/* обработка ошибок с помощью компонента ErrorBoundary */}
   {user.isAuthenticated ? (    // если пользователь авторизован, то отобразить форму с информацией о пользователе
            <Form
            name="basic"
            labelCol={{span: 10,}}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
            labelAlign="center">
                <p></p>
                <Title level={2} style={{ margin: 0 }}>Информация о пользователе:</Title>
                <p></p>
                <Title level={5} type="secondary" style={{ margin: 0 }}>Имя пользователя:  <Text>{user.userName}</Text></Title><p></p>
                {/* если пользователь является администратором, то отобразить информацию о его роли и должности */}
                {user.userRole === "admin" ? (  
                <div><Title level={5} type="secondary" style={{ margin: 0 }}>Роль пользователя: <Text>администратор</Text></Title><p></p>
                <Title level={5} type="secondary" style={{ margin: 0 }}>Должность пользователя: <Text>заведующий складом</Text></Title><p></p></div>
                ) : (
                  // если пользователь является рабочим склада, то отобразить информацию о его роли и должности
                <div><Title level={5} type="secondary" style={{ margin: 0 }}>Роль пользователя: <Text>пользователь</Text></Title><p></p>
                <Title level={5} type="secondary" style={{ margin: 0 }}>Должность пользователя: <Text>рабочий склада</Text></Title><p></p></div>
                )}
                <Title level={5} type="secondary" style={{ margin: 0 }}>Логин:  <Text>{user.userName}</Text></Title><p></p>

            </Form>) : ( ""             // если пользователь не авторизован, то ничего не отображать
    )}
    </ErrorBoundary>
    </>
  )

}
 /**
  *  экспорт компонента Information
  */
export default Information