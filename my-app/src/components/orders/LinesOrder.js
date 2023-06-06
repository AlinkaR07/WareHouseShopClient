/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Typography, Table, Space, Modal, Form, DatePicker, Input } from 'antd';
import { DeleteOutlined, SnippetsOutlined, SaveOutlined, CloseOutlined, EditOutlined, VerticalAlignBottomOutlined, PrinterOutlined } from '@ant-design/icons';
import './Style.css'
import { ErrorBoundary } from "react-error-boundary";
import {useReactToPrint} from 'react-to-print';

const { Title } = Typography;

const length = 1000;  // размер массива summa
let summa = Array(length).fill(0);  // массив для хранения суммы заказов

/**
 * определение компонента LineOrder
 * @param {*} user - компонент-пользователь
 * @param {*} removeLineOrder - функция удаления строки заказа
 * @param {*} numberOrder - номер заказа
 * @returns 
 */
const LineOrder = ({ user, removeLineOrder, numberOrder }) => {
    const [open, setOpen] = useState(false);     // Состояние модального окна
    const [openPrint, setOpenPrint] = useState(false) ;  // Состояние модального окна печати
    const [lineorders, setLineOrders] = useState([]);   // Состояние строк заказов, начальное значение - пустой массив
    const [currentPage, setCurrentPage] = useState(1);  // Состояние текущей страницы, начальное значение - 1
    const [pageSize, setPageSize] = useState(100);  // Состояние размера страницы, начальное значение - 100
    const navigate = useNavigate();   // Хук для перенаправления на другую страницу
    const[editingRow, setEditingRow] = useState(null); // Состояние редактирования строк, начальное значение - null
    const componentRef = useRef();  // Хук хранения компанента
    const [form] = Form.useForm();  // определение формы 
   
  /**
   * Функция открытия модального окна
   */
    const showModal = () => {
        setOpen(true);
      };    

    /**
     * Функция установления состояния редактировния в null(закрытие редактирования строки таблицы)
    */
    const Cancel = () => {
      setEditingRow(null);
    }

    /**
     * Функция закрытия модального окна(нажатие на кнопку "крестик")
     */
    const handleCancel = () => {
      console.log("Clicked cancel button")
      setOpen(false)
      summa = Array(length).fill(0);
      navigate("/Orders")
    };

    /**
     * Функция закрытия модального окна(нажатие на кнопку "крестик")
     */
    const handleCancelPrint = () => {
      console.log("Clicked cancel button")
      setOpenPrint(false)
      navigate("/Orders")
    };

    /**
     * Хук параметров таблицы Заказы
     */
    const [tableParams, setTableParams] = useState({
        pagination: {
          current: 1,
          pageSize: 100,
        },
      });

    
      /**
       * Столбцы таблицы Строк заказов
       */
    const columns = [
        {
          title: 'Индекс строки', 
          dataIndex: 'id',
          key: 'id',
          visible: false,
          render: (text, record) =>{          // Состояние редактирования
            return <Form.Item name="id">
                <p>{text}</p>
              </Form.Item>
          }
        },
          {
            title: 'Название товара',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) =>{          // Состояние редактирования
              return <Form.Item name="name">
                  <p>{text}</p>
                </Form.Item>
            }
          },
          {
            title: 'Закупочная стоимость',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            render: (text, record) =>{                // Состояние редактирования
              return <Form.Item name="purchasePrice">
                  <p>{text}</p>
                </Form.Item>
            }              
          },
          {
            title: 'Количество заказа',
            dataIndex: 'countOrder',
            key: 'countOrder',
            render: (text, record) =>{              // Состояние редактирования
              return <Form.Item name="countOrder">
                  <p>{text}</p>
                </Form.Item>
            }
          },
          {
              title: 'Количество поставки',
              dataIndex: 'countShipment',
              key: 'countShipment',
              render: (text, record) =>{                 // Состояние редактирования
                if(editingRow == record.id){
                 return <Form.Item name="countShipment" rules={[{
                  required: true,
                  message: 'Пожалуйста, введите количество поставленного товара'
                 }]}>
                    <Input />
                  </Form.Item>
                } else{
                  return <p>{text}</p>
                }
              }
            },
            {
              title: 'Дата изготовления',
              dataIndex: 'dataManuf',
              key: 'dataManuf',
              render: (text, record) =>{                     // Состояние редактирования
                if(editingRow == record.id){
                 return <Form.Item name="dataManuf" rules={[{
                  required: true,
                  message: 'Пожалуйста, введите дату изготовления'
                 }]}>
                    <DatePicker value={text}/>
                  </Form.Item>
                } else{
                  return <p>{text}</p>
                }
              }
            },
            {
              title: 'Действия',
              key: 'action',
              render: (_, record) => {                 // Состояние редактирования
                if(editingRow == record.id){
                  return <> <Space wrap> <Button style={{background: "#08979c"}} icon={<SaveOutlined />} htmlType='submit' type="primary"/> 
                  <Button style={{background: "#08979c"}} icon={<CloseOutlined />} onClick={Cancel} type="primary"/> </Space> </>
                 } else{
                return <>
            <Space wrap>
              <Button style={{background: "#08979c"}} icon={<EditOutlined />} type="primary" onClick={()=>{
                setEditingRow(record.id)
                form.setFieldsValue({
                  id: record.id,
                  name: record.name,
                  purchasePrice: record.purchasePrice,
                  countOrder: record.countOrder,
                  countShipment: record.countShipment,
                });
              }}/>
                <Button style={{background: "#08979c"}} icon={<DeleteOutlined />} onClick={() => deleteItem({ id: record.id })} type="primary"/>        
            </Space>
            </>
                 }
              }    
        }
  ];

  /**
   * Столбцы таблицы Строк заказов для печати
   */
    const columnsPrint = [
      {
        title: 'Название товара',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Закупочная стоимость',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',            
      },
      {
        title: 'Количество заказа',
        dataIndex: 'countOrder',
        key: 'countOrder',
      },
      {
          title: 'Количество поставки',
          dataIndex: 'countShipment',
          key: 'countShipment',
        },
        {
          title: 'Дата изготовления',
          dataIndex: 'dataManuf',
          key: 'dataManuf',
        },
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
      setLineOrders([]);
  }
}

const handleChangePage = (page, pageSize) => {
  setCurrentPage(page);
  setPageSize(pageSize);
};

const currentData = lineorders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

/**
   * Функция открытия модального окна для печати
   */
const showModalPrint = () => {
  setOpen(false);
  setOpenPrint(true);
};

/**
 * Хук печати 
 */
const handlePrint = useReactToPrint({
  content: () => componentRef.current,
});

/**
 * Класс компонента для печати
 */
class ComponentToPrint extends React.Component{
  render(){
return (
      <Form form={form} onFinish={Save}>
        <Title level={2}>Список товаров заказа № {numberOrder}</Title>
        <Table columns={columnsPrint} rowClassName="editable-row" onChange={handleTableChange} pagination={tableParams.pagination} dataSource={lineorders} rowKey="number" />
        <Title level={4}>Сумма заказа = {summa[numberOrder]} рублей</Title>
        </Form>              
)
}
}

        /**
         * Хук изменений, сслыающийся на состояние функционального компонента. Открывает модальное окно и получает строки заказов с сервера. 
         */
        useEffect(() => {
            showModal()
            setOpen(false);
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
                        (data) => {
                            let i=0;
                            for(i; i<data.length; i++){
                              console.log('Data:', data[i])
                              if((data[i].numberOrder_FK_ === numberOrder)){                      // фильтруем строки заказа, оставляя только строки текущего заказа и считаем сумму заказов 
                                summa[numberOrder] += parseInt(data[i].purchasePrice)*data[i].countOrder;
                                console.log('Summa: ', summa);
                              }
                              if(data[i].numberOrder_FK_ !== numberOrder){
                                delete data[i];
                          }
                          setLineOrders(data);
                          setTableParams({
                            ...tableParams,
                            pagination: {
                              ...tableParams.pagination,
                              total: data.totalCount,
                            },
                          });
                        }
                      },
                        (error) => {
                          console.log(error)   // Установить сообщения об ошибках
                      }                 
                    )
            }
            getLineOrders()            
        }, [setLineOrders])
    
        
        /**
         * Функция удаления Строки заказа по id
         * @param {*} id - id строки заказа 
         * @returns 
         */
        const deleteItem = async ({ id }) => {
          /**
           * определение параметров запроса
           */
            const requestOptions = {
                method: 'DELETE'
            }
            /**
             * отправка DELETE-запроса на сервер
             */
            return await fetch(`https://localhost:7253/api/LinesOrder/${id}`, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        removeLineOrder(id);
                        const updatedLineOrder = lineorders.filter((lineorders) => lineorders.id !== id)
                        setLineOrders(updatedLineOrder)
                    }
                },
                    (error) => console.log(error)  // Установить сообщения об ошибках
                )
        }
        
    /**
    * Функция редактирования строки заказа - строки таблицы
    * @param {*} formValues - значения, который вводил пользователь в компоненты формы
    */
      const Save = (formValues) => {
        console.log(formValues);
        // формирование объекта для запроса 
        const lineorder = {id: formValues.id, name: formValues.name,  purchasePrice: String(formValues.purchasePrice), countOrder: parseInt(formValues.countOrder), dataManuf: formValues.dataManuf, countShipment: parseInt(formValues.countShipment), numberOrder_FK_: numberOrder}
        // получение id строки заказа 
        const id = formValues.id;

            /**
             * определение асинхронной функции updated для внесения изменений в строку заказа
             * @returns 
             */
            const updated = async () => {
              /**
               * определение параметров запроса
               */
              const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lineorder),
              }      
              /**
               * отправка PUT-запроса на сервер
               */
              return await fetch(`https://localhost:7253/api/LinesOrder/${id}`, requestOptions)
                .then(response => response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        let i=0;
                            for(i; i<data.length; i++){
                              console.log('Data:', data[i])
                              if(data[i].numberOrder_FK_ === numberOrder){                    // фильтруем строки заказа, оставляя только строки текущего заказа и считаем сумму заказов 
                                summa += parseInt(data[i].purchasePrice)*data[i].countOrder;
                                console.log('Summa: ', summa);
                              }
                              if(data[i].numberOrder_FK_ !== numberOrder){
                                delete data[i];
                          }
                        setLineOrders(data)
                        setTableParams({
                            ...tableParams,
                            pagination: {
                              ...tableParams.pagination,
                              total: data.totalCount,
                            },
                          });
                        }
                    },
                    (error) => {
                        console.log(error)   // Установить сообщения об ошибках
                    }
                )
               }
                 updated();
                 setEditingRow(null);  // установка состояния редактировния в null(закрытие редактирования строки таблицы)
        }

        
 // возвращение компонента
    return(
    <>
      <ErrorBoundary>
          <React.Fragment>
            <div><Button style={{background: "#08979c"}} type="primary" name="showline" icon={<SnippetsOutlined />} onClick={showModal}></Button></div>
            <Modal name='orderModal' open={open} width={950} onCancel={handleCancel} footer={[null]}>
            <Form form={form} onFinish={Save}>
                <Title level={2}>Список товаров заказа № {numberOrder}</Title>
                <Table columns={columns} rowClassName="editable-row" onChange={handleTableChange} pagination={tableParams.pagination} dataSource={lineorders} rowKey="number" />
                <Title level={4}>Сумма заказа = {summa[numberOrder]} рублей</Title>
                </Form> 
              <p></p>
              <p></p>
              <Button style={{background: "#08979c"}} icon={<VerticalAlignBottomOutlined />} onClick={showModalPrint} type="primary">Напечатать</Button>
              </Modal>

              <>
          <Modal name='orderPrint' open={openPrint} width={950} onCancel={handleCancelPrint} footer={[null]}>
            <ComponentToPrint ref={componentRef} />
            <Button style={{background: "#08979c"}} icon={<PrinterOutlined />} onClick={handlePrint} type="primary">Печать</Button>
            </Modal>
            </>
          </React.Fragment>
        </ErrorBoundary>
      </>
    )
  }

  /**
  *  экспорт компонента LineOrder
  */
    export default LineOrder