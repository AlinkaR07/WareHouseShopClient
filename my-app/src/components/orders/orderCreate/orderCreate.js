/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState} from "react"
import { UserOutlined, PlusOutlined, MinusCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import { Button, Input, DatePicker, Cascader, Form, Select, Modal, Space, message} from 'antd';
import FormItem from "antd/es/form/FormItem";
import { ErrorBoundary } from "react-error-boundary";

let tovar = [];  // массив для получения списка товаров
const tovarCascader = []; // массив для получения списка товаров в cascader 
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
  const status = [
    {
      value: 'Сформирован',
      label: 'Сформирован',
    },
    {
      value: 'Заказан',
      label: 'Заказан',
    },
    {
        value: 'Поставлен',
        label: 'Поставлен',
      },
  ];


 /**
   * Содержимое для Cascader
   */
  const post = [
    {
      value: 'Мираторг',
      label: 'Мираторг',
    },
    {
      value: 'Горячая штучка',
      label: 'Горячая штучка',
    },
    {
        value: 'Останкино',
        label: 'Останкино',
      },
      {
        value: 'Черкизово',
        label: 'Черкизово',
      },
      {
        value: 'Чистая линия',
        label: 'Чистая линия',
      },
      {
        value: 'Коровка из кореновки',
        label: 'Коровка из кореновки',
      },
      {
        value: 'Руские пекари',
        label: 'Руские пекари',
      },
      {
        value: 'Дядя Ваня',
        label: 'Дядя Ваня',
      },
      {
        value: 'Maggi',
        label: 'Maggi',
      },
      {
        value: 'Nescafe',
        label: 'Nescafe',
      },
      {
        value: 'Сладкая жизнь',
        label: 'Сладкая жизнь',
      },
      {
        value: 'Агуша',
        label: 'Агуша',
      },
      {
        value: 'Фруто-Няня',
        label: 'Фруто-Няня',
      },
      {
        value: 'HEINZ',
        label: 'HEINZ',
      },
      {
        value: 'Dove',
        label: 'Dove',
      },
      {
        value: 'Duru',
        label: 'Duru',
      },
      {
        value: 'VICI',
        label: 'VICI',
      },
      {
        value: 'Barilla',
        label: 'Barilla',
      },
      {
        value: 'Макфа',
        label: 'Макфа',
      },
      {
        value: 'FishHouse',
        label: 'FishHouse',
      },
      {
        value: 'Черноголовка',
        label: 'Черноголовка',
      },
      {
        value: 'Home',
        label: 'Home',
      },
      {
        value: 'Овощебаза',
        label: 'Овощебаза',
      },
  ];

   /**
   * Функция обработки события-выбора в компоненте cascader
   * @param {*} value 
   * @returns 
   */
  const onChangeCascader = (value) => {
    return value;
  };

  const displayRender = (labels) => labels[labels.length - 1];    // Хук отображения Cascader

  /**
   * определение компонента OrderCreate
   * @param {*} user - компонент-пользователь
   * @param {*} setUser - функция сеттера для управления состоянием компонента user
   * @param {*} addOrder - функция добавления заказа
   * @param {*} addLineOrder - функция добавления строк заказа
   * @returns 
   */
  const OrderCreate = ({ user, setUser, addOrder, addLineOrder }) => {
    const [open, setOpen] = useState(false)  // Состояние модального окна
    const [orders, setOrders] = useState([]); // Состояние заказов, начальное значение - пустой массив
    const [lineOrders, setLineOrders] = useState([])  // Состояние строк заказов, начальное значение - пустой массив
    const [tovars, setTovars] = useState([]); // Состояние товаров, начальное значение - пустой массив
    const [ form ] = Form.useForm(); // определение формы
    
    /**
     * Функция открытия модального окна
     */
    const showModal = () => {
      setOpen(true);
      console.log('status', status);
    };

    /**
     * Функция закрытия модального окна(нажатие на кнопку "крестик")
     */
    const handleCancel = () => {
      console.log("Clicked cancel button")
      setOpen(false)
    }

 
    /**
     * Хук параметров таблицы 
     */
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
    
    const handleTableChange = (pagination, filters, sorter) => {
      setTableParams({
        pagination,
        filters,
        ...sorter,
      });
    
      // `dataSource` is useless since `pageSize` changed
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setOrders([]);
      }
    }
    
    /**
     * Хук изменений, сслыающийся на состояние функционального компонента. Открывает модальное окно и получает товары с сервера. 
     */
    useEffect(() => {
      showModal()
      setOpen(false);
      const getTovars = async () => {
        /**
         * определение параметров запроса
         */
        const requestOptions = {
            method: 'GET'
        }
        /**
         * отправка GET-запроса на сервер
         */
        return await fetch("https://localhost:7253/api/Tovar", requestOptions)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log('Data:', data)
                    for (var i = 0; i < data.length; i++) {
                      tovar[i]=[];
                      tovarCascader[i]=[];
                      for (var j = 0; j < 1; j++) {
                          tovar[i][j] = data[i].codTovara;
                          tovar[i][j+1] = data[i].name;
                          tovarCascader[i]["value"] = data[i].name;
                          tovarCascader[i]["label"] = data[i].name;
                      }
                  }
                  console.log('Tovar:', tovar);
                  console.log('Cascader:', tovarCascader);
                },
                (error) => {
                    console.log(error)   // Установить сообщения об ошибках
                }
            )
    }
    getTovars()
    }, [])


    /**
     * Функция добавления заказа - строки таблицы
     * @param {*} formValues - значения, который вводил пользователь в компоненты формы
     */
    const orderCreate = async (formValues) => {
      console.log("Success:", formValues)
      // формирование объекта для запроса
      const order = { dataOrder: formValues.DataOrder, dataShipment: null, statusOrder: String(formValues.StatusOrder[0]), nameOrganizationPostavshik_FK_: String(formValues.NameOrganizationPostavshik_FK_[0]), fiOworker_FK_: formValues.FIOworker, lineOrders: null, order: null}
      let idTovar;  // id товара в Таблице
      let updateCountTovar;  // количество, на которое будет изменять количество товара в наличии

      /**
       * определение асинхронной функции create для создания заказа
       * @returns 
       */
      const create = async () => {
        /**
         * определение параметров запроса
         */
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      }      

      /**
       * отправка POST-запроса на сервер
       */
        const response = await fetch("https://localhost:7253/api/Orders/", requestOptions)
        return await response.json()
        .then((data) => {
                       console.log(data)
                   if (response.ok) {
                     addOrder(data)
                     setOrders(data)
                    let i=0;
                    for(i; i<formValues.linesorder.length; i++) {
                      let k=0;
                      for(k; k<tovar.length; k++){
                       let j=0;
                       if(formValues.linesorder[i].nameTovar[0] === tovar[k][j+1]){   // нахождение id товара, который изменяется
                              idTovar = tovar[k][j];
                              break;
                       }
                      }
                      // формирование объекта для запроса
                     const lineorder = {name: String(formValues.linesorder[i].nameTovar[0]),  purchasePrice: String(formValues.linesorder[i].PurchasePrice), countOrder: parseInt(formValues.linesorder[i].CountOrder), countShipment: null, codTovara_FK_: idTovar, dataManuf: null, numberOrder_FK_: data.number}
                     console.log('LineOrder:', lineorder);
                     updateCountTovar = lineorder.countOrder;  // определяем количество, на которое будет изменять количество товара в наличии товара
                     

                     /**
                      * определение асинхронной функции createline для создания строки заказа
                      * @returns 
                      */
                     const createline = async () => {
                      /**
                       * определение параметров запроса
                       */
                      const requestOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(lineorder),
                      }

                      /**
                       *  отправка POST-запроса на сервер
                       */
                     const response = await fetch("https://localhost:7253/api/LinesOrder/", requestOptions) 
                     return await response.json()
                     .then((data) => {
                       console.log(data)
                        if (response.ok) {
                          addLineOrder(data)
                          setLineOrders(data)

                       }
                    },
                   (error) => console.log(error)  // Установить сообщения об ошибках
              )
            }
            createline()
          
            if(order.statusOrder === "Поставлен") {    // если статус заказа "Поставлен", то нужно изменить кол-во товара в таблице Товары
            
              /**
               * определение асинхронной функции GetTovar для полчкния товара по id
               * @returns 
               */
              const GetTovar = async () => {
              /**
               * определение параметров запроса
               */
              const requestOptions = {
                  method: 'GET'
              }
              /**
               * отправка GET-запроса на сервер
               */
              return await fetch(`https://localhost:7253/api/Tovar/${idTovar}`, requestOptions)
              .then(response => response.json())
              .then(
                  (data) => {
                    // формирование объекта для запроса
                    const tovar = { codTovara: idTovar, name: data.name, dateExpiration: data.dateExpiration, category: data.category, price: data.price, count: data.count + updateCountTovar}
              
                    /**
                     * определение асинхронной функции updated для внесения изменения в товар
                     * @returns 
                     */
                    const updated = async () => {
                      /**
                       * определение параметров запроса
                       */
                      const requestOptions = {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(tovar),
                      }      
                
                      /**
                       * отправка PUT-запроса на сервер
                       */
                      return await fetch(`https://localhost:7253/api/Tovar/${idTovar}`, requestOptions)
                        .then(response => response.json())
                        .then(
                            (data) => {
                                console.log('Data:', data)
                                setTovars(data)
                            },
                            (error) => {
                                console.log(error)  // Установить сообщения об ошибках
                            }
                        )
                       }
                         updated();
                  },
                      (error) => console.log(error)  // Установить сообщения об ошибках
                  )
          } 
          GetTovar();
          }
        }
          }}) 
        }
         create();
  }

    // возвращение компонента
    return (
      <ErrorBoundary>
      <>
       {user.isAuthenticated ? (
         <>
         <Modal open={open} onCancel={handleCancel} footer={[null]}>
            <h3>Создание нового заказа</h3>
           <Form 
           form={form}
           onFinish={orderCreate}
           name="basic"
           style={{
             maxWidth: 900,
           }}
           autoComplete="off">
            <Form.Item  label="ФИО сотрудника:" name="FIOworker" placeholder="Введите ФИО"
          rules={[
           {
             //required: true,
             message: 'Пожалуйста, введите свое ФИО!',
           },
                ]}>
               <Input prefix={<UserOutlined/>} />
             </Form.Item>
             <Form.Item label="Дата заказа:" name="DataOrder" >
             <DatePicker onChange={onChangeDatePicker}/>
               </Form.Item>
               <Form.Item label="Название организации поставщика:" name="NameOrganizationPostavshik_FK_">
              <Cascader options={post} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
             </Form.Item>
             <Form.Item label="Статус заказа:" name="StatusOrder" >
             <Cascader options={status} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
             </Form.Item>
             <h4>Введите данные о товаре(название товара, закупочную стоимость, количество):</h4>
               <Form.Item>
   <Form.List name="linesorder">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{
                display: 'flex',
                marginBottom: 8,
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, 'nameTovar']}
              >
              <Cascader options={tovarCascader} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'PurchasePrice']}
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, введите стоимость!',
                  },
                ]}
              >
                <Input placeholder="Введите стоимость" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'CountOrder']}
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, введите количество!',
                  },
                ]}
              >
                <Input placeholder="Введите количество" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Добавить товар в заказ
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
         </Form.Item>
               <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
               >
               <Button style={{background: "#08979c"}} icon={<CheckCircleOutlined/>} type="primary" htmlType="submit" onClick={handleCancel}>Создать</Button>
               </Form.Item>
           </Form>
           </Modal> 
           </>) : ( ""
           )}
           {user.isAuthenticated ? (
           <div><Button style={{background: "#08979c"}} icon={<PlusOutlined />} type="primary" name="addneworder" onClick={showModal}>Создать новый заказ</Button></div>) : ( ""
           )} 
           </>  
           </ErrorBoundary>    
   )
}
  
/**
  *  экспорт компонента OrderCreate
  */
export default OrderCreate
