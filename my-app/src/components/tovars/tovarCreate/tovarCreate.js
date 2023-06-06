/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState} from "react"
import { ShoppingOutlined, PlusOutlined, CheckCircleOutlined} from '@ant-design/icons';
import { Button, Input, DatePicker, Cascader, Form, Select, Modal, Space, message} from 'antd';
import FormItem from "antd/es/form/FormItem";
import { ErrorBoundary } from "react-error-boundary";

const { Option } = Select;

/**
 * Функция обработки события-выбора в компоненте DatePicker
 * @param {*} date 
 * @param {*} dateString 
 * @returns 
 */
const onChangeDatePicker = (date, dateString) => {
    console.log(date, dateString);
    return dateString;
  };

  /**
   * Содержимое для Cascader
   */
  const category = [
    {
      value: 'Мясо',
      label: 'Мясо',
    },
    {
      value: 'Молочные продукты',
      label: 'Молочные продукты',
    },
    {
        value: 'Бакалея',
        label: 'Бакалея',
      },
      {
        value: 'Рыба и морепродукты',
        label: 'Рыба и морепродукты',
      },
      {
        value: 'Хлеб',
        label: 'Хлеб',
      },
      {
        value: 'Детские товары',
        label: 'Детские товары',
      },
      {
        value: 'Овощи и фрукты',
        label: 'Овощи и фрукты',
      },
      {
        value: 'Товары для дома',
        label: 'Товары для дома',
      },
  ];

  /**
   * Функция обработки события-выбора в компоненте cascader
   * @param {*} value 
   * @returns 
   */
  const onChangeCascader = (value) => {
   // console.log(value);
    return value;
  };

  const displayRender = (labels) => labels[labels.length - 1];

  /**
   * определение компонента TovarCreate
   * @param {*} user - компонент-пользователь
   * @param {*} setUser - функция сеттера для управления состоянием компонента user
   * @param {*} addTovar - функция добавления товара
   * @returns 
   */
  const TovarCreate = ({ user, setUser, addTovar}) => {
    const [open, setOpen] = useState(false) // Состояние модального окна
    const [tovars, setTovars, getTovars] = useState([]); // Состояние товаров, начальное значение - пустой массив

    /**
     * Хук параметров таблицы 
     */
    const [tableParams, setTableParams] = useState({
        pagination: {
          current: 1,
          pageSize: 5,
        },
      });
    

      /**
       * Функция открытия модального окна
       */
    const showModal = () => {
      setOpen(true);
    };
    
    /**
     * Хук изменений, сслыающийся на состояние функционального компонента. Открывает модальное окно.
     */
    useEffect(() => {
      showModal()
      setOpen(false);
    }, [])

    const [ form ] = Form.useForm();  // определение формы

    /**
     * Функция добавления товара - строки таблицы
     * @param {*} formValues - значения, который вводил пользователь в компоненты формы
     */
    const tovarCreate = async (formValues) => {
      console.log("Success:", formValues)
      // формирование объекта для запроса
      const tovar = { name: formValues.Name, dateExpiration: formValues.DataExpiration, category: String(formValues.Category[0]), price: parseFloat(formValues.Price), count: parseInt(formValues.Count)}
      console.log(tovar);
    
      /**
       * определение асинхронной функции create для создания товара
       * @returns 
       */
      const create = async () => {
        /**
         * определение параметров запроса
         */
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tovar),
      }      

      /**
       * отправка POST-запроса на сервер
       */
      return await  fetch("https://localhost:7253/api/Tovar/", requestOptions)
        .then(response => response.json())
                .then(
                    (data) => {
                      console.log('Data:', data)
                      setTovars(data)
                      setTableParams({
                          ...tableParams,
                          pagination: {
                            ...tableParams.pagination,
                            total: data.totalCount,
                          },
                    });
                },
                   (error) => console.log(error)  // Установить сообщения об ошибках
              )
        }
         create()
      }


      /**
       * Функция закрытия модального окна(нажатие на кнопку "крестик")
       */
      const handleCancel = () => {
        console.log("Clicked cancel button")
        setOpen(false)
      }

    // возвращение компонента
    return (
      <ErrorBoundary>
      <>
       {user.isAuthenticated && user.userRole === 'admin' ? (
         <>
         <Modal open={open} onCancel={handleCancel} footer={[null]}>
            <h3>Добавление нового товара</h3>
           <Form 
           form={form}
           onFinish={tovarCreate}
           name="basic"
           style={{
             maxWidth: 900,
           }}
           autoComplete="off">
            <Form.Item  label="Название товара:" name="Name" placeholder="Введите название товара"
          rules={[
           {
             //required: true,
             message: 'Пожалуйста, введите название товара!',
           },
                ]}>
               <Input prefix={<ShoppingOutlined/>} />
             </Form.Item>
             <Form.Item label="Срок годности:" name="DataExpiration" >
             <DatePicker onChange={onChangeDatePicker}/>
               </Form.Item>
               <Form.Item label="Категория:" name="Category">
              <Cascader options={category} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
             </Form.Item>
             <Form.Item label="Цена товара для покупателя:" name="Price" >
             <Input />
             </Form.Item>
             <Form.Item label="Количество товара в наличии:" name="Count" >
             <Input />
             </Form.Item>
               <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
               >
               <Button style={{background: "#08979c"}} icon={<CheckCircleOutlined/>} type="primary" htmlType="submit" onClick={handleCancel}>Добавить</Button>
               </Form.Item>
           </Form>
           </Modal> 
           </>) : ( ""
           )}
           {user.isAuthenticated && user.userRole === 'admin' ? (
           <div><Button style={{background: "#08979c"}} icon={<PlusOutlined />} type="primary" name="addnewtovar" onClick={showModal}>Добавить новый товар</Button></div>) : ( ""
           )} 
           </>  
           </ErrorBoundary>    
   )
}
  
/**
  *  экспорт компонента TovarCreate
  */
export default TovarCreate
