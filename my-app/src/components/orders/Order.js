/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState} from 'react'
import { Button, Typography, Table, Space, Form, DatePicker, Cascader} from 'antd';
import { DeleteOutlined, EditOutlined,  CloseOutlined, SaveOutlined,} from '@ant-design/icons';
import './Style.css'
import { ErrorBoundary } from "react-error-boundary";
import LineOrder from './LinesOrder';

let tovar = [];  // массив для получения списка товаров в cascader 
let number;  // вспогательная переменная для номера заказа

const { Title } = Typography;

/**
 * определение компонента Order
 * @param {*} user - компонент-пользователь
 * @param {*} removeOrder - функция удаления заказа
 * @returns 
 */
const Order = ({ user, removeOrder }) => {
const [orders, setOrders] = useState([]); // Состояние заказов, начальное значение - пустой массив
const [currentPage, setCurrentPage] = useState(1);  // Состояние текущей страницы, начальное значение - 1
const [pageSize, setPageSize] = useState(100); // Состояние размера страницы, начальное значение - 100
const [lineorders, setLineOrders] = useState(false);  // Состояние модальных окон со строками заказов, начальное значение - false
const [tovars, setTovars] = useState([]); // Состояние товаров, начальное значение - пустой массив
const removeLineOrder = (removeNumber) => setLineOrders(orders.filter(({ number }) => number !== removeNumber)); // функция удаления заказа по номеру 
const [user1, setUser] = useState({ isAuthenticated: false, userName: "", userRole: "" }); // объект неавторизованного пользователя
const[editingRow, setEditingRow] = useState(null); // Состояние редактирования строк, начальное значение - null
const currentData = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
const [form] = Form.useForm(); // определение формы 


const handleChangePage = (page, pageSize) => {
  setCurrentPage(page);
  setPageSize(pageSize);
};

/**
 * Хук параметров таблицы Заказы
 */
const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  /**
   * Столбцы таблицы Заказы
   */
  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'number',
      key: 'number',
      render: (text, record) =>{      // Состояние редактирования
        return <Form.Item name="number">
            <p>{text}</p>
          </Form.Item>
      }
    },
    {
      title: 'Дата заказа',
      dataIndex: 'dataOrder',
      key: 'dataOrder',
      render: (text, record) =>{            // Состояние редактирования
        if(editingRow == record.number){
         return <Form.Item name="dataOrder" rules={[{
          required: true,
          message: 'Пожалуйста, введите дату заказа'
         }]}>
            <DatePicker value={text}/>
          </Form.Item>
        } else{
          return <p>{text}</p>
        }
      }
    },
    {
      title: 'Дата поставки',
      dataIndex: 'dataShipment',
      key: 'dataShipment',
      render: (text, record) =>{                // Состояние редактирования
        if(editingRow == record.number){
         return <Form.Item name="dataShipment">
            <DatePicker value={text}/>
          </Form.Item>
        } else{
          return <p>{text}</p>
        }
      }
    },
    {
        title: 'Поставщик',
        dataIndex: 'nameOrganizationPostavshik_FK_',
        key: 'nameOrganizationPostavshik_FK_',
        render: (text, record) =>{                       // Состояние редактирования
          return <Form.Item name="nameOrganizationPostavshik_FK_">
              <p>{text}</p>
            </Form.Item>
        },
      },
      {
        title: 'ФИО работника слада',
        dataIndex: 'fiOworker_FK_',
        key: 'fiOworker_FK_',
        render: (text, record) =>{                    // Состояние редактирования
          return <Form.Item name="fiOworker_FK_">
              <p>{text}</p>
            </Form.Item>
        },
      },
      {
      title: "Статус заказа",
      dataIndex: "statusOrder",
      key: "statusOrder",
      render: (text, record) =>{                 // Состояние редактирования
        if(editingRow == record.number){
         return <Form.Item name="statusOrder" rules={[{
          required: true,
          message: 'Пожалуйста, выберите статус'
         }]}>
            <Cascader options={status} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
          </Form.Item>
        } else{
          return <p>{text}</p>
        }
      },
      },
      {
      title: 'Действия',
      key: 'action',
      render: (_, record) => {               // Состояние редактирования
        number = record.number;
        if(editingRow == record.number){
          return <> <Space wrap> <Button style={{background: "#08979c"}} icon={<SaveOutlined />} htmlType='submit' type="primary"/> 
          <Button style={{background: "#08979c"}} icon={<CloseOutlined />} onClick={Cancel} type="primary"/> </Space> </>
         } else{
        return <>
    <Space wrap>
      <LineOrder user={user1} setUser={setUser}  lineorder={lineorders} setLineOrders={setLineOrders} removeLineOrder={removeLineOrder} numberOrder={record.number}/>
      <Button style={{background: "#08979c"}} icon={<EditOutlined />} type="primary" onClick={()=>{
        setEditingRow(record.number)
        form.setFieldsValue({
          number: record.number,
          nameOrganizationPostavshik_FK_: record.nameOrganizationPostavshik_FK_,
          fiOworker_FK_: record.fiOworker_FK_,
          statusOrder: record.statusOrder,
        });
      }}/>
      {user.isAuthenticated && user.userRole === 'admin' ? (
        <Button style={{background: "#08979c"}} icon={<DeleteOutlined />} onClick={() => deleteItem({ number: record.number })} type="primary"/> 
      ) : (
        ''
      )}
    </Space>
    </>
         }
      }
}
];

/**
 * Хук разделения таблицы Заказы на страницы
 * @param {*} pagination 
 * @param {*} filters 
 * @param {*} sorter 
 */
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
 * Функция установления состояния редактировния в null(закрытие редактирования строки таблицы)
 */
  const Cancel = () => {
    setEditingRow(null);
  }

  /**
   * Функция обработки события-выбора в компоненте cascader
   * @param {*} value 
   * @returns 
   */
  const onChangeCascader = (value) => {
    return value;
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
  
   const displayRender = (labels) => labels[labels.length - 1];  // Хук отображения Cascader

 /**
   * Хук изменений, сслыающийся на состояние функционального компонента. Получает заказы и товары с сервера. 
   * 
   */
    useEffect(() => {
        const getOrders = async () => {
                /**
                  * определение параметров запроса
                */
            const requestOptions = {
                method: 'GET'
            }

                 /**
                  * отправка GET-запроса на сервер
                */
            return await fetch("https://localhost:7253/api/Orders", requestOptions)
                .then(response => response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        setOrders(data)
                        setTableParams({
                            ...tableParams,
                            pagination: {
                              ...tableParams.pagination,
                              total: data.totalCount,
                            },
                          });
                    },
                    (error) => {
                        console.log(error)   // Установить сообщения об ошибках
                    }
                )
        }
        getOrders()
          /**
             * определение параметров запроса
          */
        const getTovars = async () => {
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
                        for (var j = 0; j < 1; j++) {
                            tovar[i][j] = data[i].codTovara;
                            tovar[i][j+1] = data[i].name;
                        }
                    }
                    console.log('Tovar:', tovar);
                  },
                  (error) => {
                      console.log(error)
                  }
              )
      }
      getTovars()
    }, [setOrders])

  /**
   * Функция удаления Заказа по номеру
   * @param {*} number - номер заказа 
   * @returns 
   */
  const deleteItem = async ({ number }) => {
          /**
             * определение параметров запроса
          */
        const requestOptions = {
            method: 'DELETE'
        }
          /**
          * отправка DELETE-запроса на сервер
          */
        return await fetch(`https://localhost:7253/api/Orders/${number}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    removeOrder(number);
                    const updatedOrder = orders.filter((orders) => orders.number !== number)
                    setOrders(updatedOrder)
                }
            },
                (error) => console.log(error)  // Установить сообщения об ошибках
            )
  }

   /**
    * Функция редактирования заказа - строки таблицы
    * @param {*} formValues - значения, который вводил пользователь в компоненты формы
    */
const Save = (formValues) => {
  // формирование объекта для запроса 
  const order = { number: formValues.number, dataOrder: formValues.dataOrder, dataShipment: formValues.dataShipment, statusOrder: String(formValues.statusOrder[0]), nameOrganizationPostavshik_FK_: formValues.nameOrganizationPostavshik_FK_, fiOworker_FK_: formValues.fiOworker_FK_, lineOrders: null, order: null}
  console.log('Order: ', order); 
  // получение номера заказа  
  const number = formValues.number;
  console.log('Number: ', number);  

   /**
   * определение асинхронной функции updated для внесения изменений в заказ
   * @returns 
   */
      const updated = async () => {
        /**
             * определение параметров запроса
          */
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }      
          /**
               * отправка PUT-запроса на сервер
          */
        return await fetch(`https://localhost:7253/api/Orders/${number}`, requestOptions)
          .then(response => response.json())
          .then(
              (data) => {
                  console.log('Data:', data)
                  setOrders(data)
                  setTableParams({
                      ...tableParams,
                      pagination: {
                        ...tableParams.pagination,
                        total: data.totalCount,
                      },
                    });
              },
              (error) => {
                  console.log(error)  // Установить сообщения об ошибках
              }
          )
         }
           updated();
           setEditingRow(null); // установка состояния редактировния в null(закрытие редактирования строки таблицы)

          if(order.statusOrder === "Поставлен"){   // если статус заказа "Поставлен", то нужно изменить кол-во товара в таблице Товары
            let idTovar;  // id товара в Таблице
            let updateCountTovar;  // количество, на которое будет изменять количество товара в наличии
              
            /**
              * определение асинхронной функции getLineOrders для получения строк заказа
              * @returns 
            */
            const getLineOrders = async () => {
              /**
               * определение параметров запроса
               */
              const requestOptions = {
                  method: 'GET'
              }
              /**
               * отправка GET-запроса на сервер
               */
              return await fetch("https://localhost:7253/api/LinesOrder", requestOptions)
                  .then(response => response.json())
                  .then(
                      (data) => {    // если успешно, то:
                          let i=0;
                          for(i; i<data.length; i++){
                            if(data[i].numberOrder_FK_ !== number){    // фильтруем строки заказа, оставляя только строки текущего заказа
                              delete data[i];
                            }
                          }
                          for(i; i<data.length; i++){
                            let k=0;
                             for(k; k<tovar.length; k++){
                              let j=0;
                            if((data[i].name === tovar[k][j+1])){
                              idTovar = tovar[k][j];                   // определяем id товара, который был поставлен
                              updateCountTovar = data.countOrder;      // определяем количество, на которое будет изменять количество товара в наличии товара
                              break;
                            }
                            
                            /**
                             * определение асинхронной функции GetTovar для получения товара
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
                                       * отправка GET-запроса на сервер
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
                    },
                      (error) => {
                        console.log(error)  // Установить сообщения об ошибках
                    }                 
                  )
          }
          getLineOrders()   
      }
  }
  
    // возвращение компонента
    return (
      <ErrorBoundary>
        <React.Fragment>
        <Form form={form} onFinish={Save}>
            <Title level={2}>Список заказов</Title>
            <Table columns={columns} rowClassName="editable-row" onChange={handleTableChange} pagination={tableParams.pagination} dataSource={orders} rowKey="number" />
        </Form>
        </React.Fragment>
        </ErrorBoundary>
    )
}

/**
  *  экспорт компонента Order
  */
export default Order