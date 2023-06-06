/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "antd"
import { ErrorBoundary } from "react-error-boundary";

/**
 * определение компонента Logoff
 * @param {*} user - компонент-пользователь
 * @param setUser  - функция сеттера для управления состоянием компонента user
 * @returns 
 */
const Logoff = ({ user, setUser }) => {
  const [open, setOpen] = useState(false) // Состояние модального окна
  const navigate = useNavigate() // Хук для перенаправления на другую страницу

  /**
   * Функция открытия модального окна
   */
  const showModal = () => {
    setOpen(true)
  }

  /**
   * Хук изменений, сслыающийся на состояние функционального компонента
   */
  useEffect(() => {
    showModal()
  }, [])

  /**
   * Функция закрытия модального окна(нажатие на кнопку "крестик")
   */
  const handleCancel = () => {
    console.log("Clicked cancel button")
    setOpen(false)
    navigate("/")
  }

  /**
   * определение асинхронной функции Logoff события onSubmit формы
   * @param {*} event 
   * @returns 
   */
  const Logoff = async (event) => {
    event.preventDefault()

    /**
     * определение параметров запроса
     */
    const requestOptions = {
      method: "POST"
    }

     /**
     * отправка POST-запроса на сервер
     */
    return await fetch(
      "api/account/logoff",
      requestOptions
    )
      .then((response) => {
                // если ответ успешный (код 200) и пользователь не авторизован, то перейти на страницу входа. Если ответ с кодом 401, то перейти на главную страницу
        response.status === 200 &&
          setUser({ isAuthenticated: false, userName: "", userRole: "" })
          response.status === 401 ? navigate("/login") : navigate("/")
          setOpen(false)  // Закрыть модальное окно
      })
  }

  // возвращение компонента
  return (
    <ErrorBoundary>  {/* обработка ошибок с помощью компонента ErrorBoundary */}
    <>
    <Modal title="Выход" open={open} onOk={Logoff} onCancel={handleCancel}>
      {user.isAuthenticated ? (    // если пользователь авторизован, то отправить подверждение действия
        <h3>Вы действительно хотите выполнить выход?</h3>
      ) : (     // если пользователь не авторизован, то вывести текст "Вы гость"
        <h3>Вы гость.</h3>
      )}
      </Modal>
    </>
    </ErrorBoundary>
  )
}

 /**
  *  экспорт компонента Logoff
  */
export default Logoff