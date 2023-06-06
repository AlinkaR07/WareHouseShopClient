/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Typography, Table, Space, Modal, Form, Input, Cascader, DatePicker } from 'antd';
import { DeleteOutlined, SnippetsOutlined, EditOutlined, SaveOutlined, CloseOutlined, PrinterOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import './Style.css'
import { ErrorBoundary } from "react-error-boundary";
import {useReactToPrint} from 'react-to-print';

const { Title } = Typography;

const length = 1000;  // размер массива summa
let summa = Array(length).fill(0); // массив для хранения суммы актов списаний

/**
 * 
 * @param {*} user - компонент-пользователь
 * @param {*} removeLineWrite - функция удаления строки акта списания
 * @param {*} numberWrite - номер акта списания
 * @returns 
 */
const LineWrite = ({ user, removeLineWrite, numberWrite }) => {
    const [open, setOpen] = useState(false);  // Состояние модального окна
    const [openPrint, setOpenPrint] = useState(false);  // Состояние модального окна печати
    const [linewrites, setLineWrites] = useState([]);  // Состояние строк заказов, начальное значение - пустой массив
    const [currentPage, setCurrentPage] = useState(1); // Состояние текущей страницы, начальное значение - 1
    const [pageSize, setPageSize] = useState(100); // Состояние размера страницы, начальное значение - 100
    const navigate = useNavigate(); // Хук для перенаправления на другую страницу
    const[editingRow, setEditingRow] = useState(null);  // Состояние редактирования строк, начальное значение - null
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
      navigate("/Writes")
    }

    /**
     * Функция закрытия модального окна(нажатие на кнопку "крестик")
     */
    const handleCancelPrint = () => {
      console.log("Clicked cancel button")
      setOpenPrint(false)
      navigate("/Writes")
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

      const handleChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
      };
    
      /**
       * Столбцы таблицы Строк актов списаний 
       */
      const columnsAdmin = [
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
            render: (text, record) =>{        // Состояние редактирования
              return <Form.Item name="name">
                  <p>{text}</p>
                </Form.Item>
            }
          },
          {
            title: 'Количество списания',
            dataIndex: 'count',
            key: 'count',
            render: (text, record) =>{           // Состояние редактирования
              if(editingRow == record.id){
               return <Form.Item name="count" rules={[{
                required: true,
                message: 'Пожалуйста, введите количество'
               }]}>
                  <Input />
                </Form.Item>
              } else{
                return <p>{text}</p>
              }
            }
      
          },
            {
              title: 'Сумма списания',
              dataIndex: 'summa',
              key: 'summa',
              render: (text, record) =>{            // Состояние редактирования
                if(editingRow == record.id){
                 return <Form.Item name="summa" rules={[{
                  required: true,
                  message: 'Пожалуйста, введите сумму'
                 }]}>
                    <Input />
                  </Form.Item>
                } else{
                  return <p>{text}</p>
                }
              }
            },
            {
              title: 'Действия',
              key: 'action',
              render: (_, record) => {         // Состояние редактирования
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
                  count: record.count,
                  summa: record.summa,
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
   * Столбцы таблицы Строк актов для печати
   */
      const columnsUserAndPrint = [
        {
        title: 'Название товара',
        dataIndex: 'name',
        key: 'name',
      },    
      {
        title: 'Количество списания',
        dataIndex: 'count',
        key: 'count',
      },
        {
          title: 'Сумма списания',
          dataIndex: 'summa',
          key: 'summa',
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
            setLineWrites([]);
        }
    }

    const currentData = linewrites.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <Title level={2}>Список товаров акта списания</Title>
        <Table columns={columnsUserAndPrint} onChange={handleTableChange} pagination={tableParams.pagination} dataSource={linewrites} rowKey="number" />
        <Title level={4}>Сумма заказа = {summa[numberWrite]} рублей</Title>
      </Form>            
      )
      }
      }
    
      /**
       * Хук изменений, сслыающийся на состояние функционального компонента. Открывает модальное окно и получает строки актов списаний с сервера. 
       */
        useEffect(() => {
            showModal()
            setOpen(false);
            const getLineWrites = async () => {
              /**
               * определение параметров запроса
               */
                const requestOptions = {
                    method: 'GET'
                }
                /**
                 * отправка GET-запроса на сервер
                 */
                return await fetch("https://localhost:7253/api/LinesWrite", requestOptions)
                    .then(response => response.json())
                    .then(
                        (data) => {
                          let i=0;
                          for(i; i<data.length; i++){
                            console.log('Data:', data[i])
                            if(data[i].numberActWrite_FK_ === numberWrite){        // фильтруем строки актов списаний, оставляя только строки текущего акта списания и считаем сумму актов 
                              summa[numberWrite] += parseInt(data[i].summa)*data[i].count;
                              console.log('Summa: ', summa);
                            }
                            if(data[i].numberActWrite_FK_ !== numberWrite){
                              delete data[i];
                        }
                            setLineWrites(data);
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
                            console.log(error)  // Установить сообщения об ошибках
                        }
                    )
            }
            getLineWrites()
        }, [setLineWrites])
    
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
            return await fetch(`https://localhost:7253/api/LinesWrite/${id}`, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        removeLineWrite(id);
                        const updatedLineWrite = linewrites.filter((linewrites) => linewrites.id !== id)
                    setLineWrites(updatedLineWrite)
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
        const linewrite = {id: formValues.id, name: formValues.name, summa: parseFloat(formValues.summa), count: parseInt(formValues.count), numberActWrite_FK_: numberWrite}
        // получение id строки акта списания 
        const id = formValues.id;
      
        /**
         * определение асинхронной функции updated для внесения изменений в строку акта списания
         * @returns 
         */
            const updated = async () => {
              /**
               * определение параметров запроса
               */
              const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(linewrite),
              }      
              /**
               * отправка PUT-запроса на сервер
               */
              return await fetch(`https://localhost:7253/api/LinesWrite/${id}`, requestOptions)
                .then(response => response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        let i=0;
                          for(i; i<data.length; i++){
                            console.log('Data:', data[i])
                            if(data[i].numberActWrite_FK_ === numberWrite){     // фильтруем строки актов списаний, оставляя только строки текущего акта списания и считаем сумму актов 
                              summa[numberWrite] += parseInt(data[i].summa);
                            }
                            if(data[i].numberActWrite_FK_ !== numberWrite){
                              delete data[i];
                        }
                        setLineWrites(data)
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
                        console.log(error)  // Установить сообщения об ошибках
                    }
                )
               }
                 updated();
                 setEditingRow(null);    // установка состояния редактировния в null(закрытие редактирования строки таблицы)
        }
          
       // возвращение компонента
        return (
          <ErrorBoundary>
            <React.Fragment>
            <Modal width={900} open={open} onCancel={handleCancel} footer={[null]}>
               <Form form={form} onFinish={Save}>
                <Title level={2}>Список товаров акта списания</Title>
                <Table columns={columnsAdmin} onChange={handleTableChange} pagination={tableParams.pagination} dataSource={linewrites} rowKey="number" />
                <Title level={4}>Сумма списания = {summa[numberWrite]} рублей</Title>
              </Form>
              <p></p>
              <p></p>
              <Button style={{background: "#08979c"}} icon={<VerticalAlignBottomOutlined />} onClick={showModalPrint} type="primary">Напечатать</Button>
            </Modal>
            <div><Button style={{background: "#08979c"}} type="primary" name="showline" icon={<SnippetsOutlined />} onClick={showModal}></Button></div>

            <>
          <Modal name='writePrint' open={openPrint} width={950} onCancel={handleCancelPrint} footer={[null]}>
            <ComponentToPrint ref={componentRef} />
            <Button style={{background: "#08979c"}} icon={<PrinterOutlined />} onClick={handlePrint} type="primary">Печать</Button>
            </Modal>
            </>
            </React.Fragment>
            </ErrorBoundary>
        )
    }
    
 /**
  *  экспорт компонента LineWrite
  */
    export default LineWrite