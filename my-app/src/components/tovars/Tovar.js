/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState } from 'react'
import { Button, Typography, Table, Space, Form, Input,  Cascader, DatePicker} from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined} from '@ant-design/icons';
import './Style.css'
import { ErrorBoundary } from "react-error-boundary";
import FormItem from 'antd/es/form/FormItem';


const { Title } = Typography;

/**
 * определение компонента Tovar
 * @param {*} user - компонент-пользователь
 * @param {*} removeTovar - функция удаления товара
 * @returns 
 */
const Tovar = ({ user, removeTovar }) => {
const [tovars, setTovars] = useState([]);  // Состояние товаров, начальное значение - пустой массив
const [currentPage, setCurrentPage] = useState(1);// Состояние текущей страницы, начальное значение - 1
const [pageSize, setPageSize] = useState(100); // Состояние размера страницы, начальное значение - 100
const[editingRow, setEditingRow] = useState(null); // Состояние редактирования строк, начальное значение - null
const [form] = Form.useForm(); // определение формы 


  /**
   * Функция обработки события-выбора в компоненте cascader
   * @param {*} value 
   * @returns 
   */
const onChangeCascader = (value) => {
   return value;
 };
 const displayRender = (labels) => labels[labels.length - 1];   // Хук отображения Cascader

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
 * Функция установления состояния редактировния в null(закрытие редактирования строки таблицы)
 */
const Cancel = () => {
  setEditingRow(null);
}

/**
 * Хук разделения таблицы Заказы на страницы
 * @param {*} pagination 
 * @param {*} filters 
 * @param {*} sorter 
 */
const [tableParams, setTableParams] = useState({
  pagination: {
    current: 1,
    pageSize: 15,
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
      setTovars([]);
  }
}


  /**
   * Столбцы таблицы Товары для админа
   */
const columnsAdmin = [
  {
    title: 'Код товара',
    dataIndex: 'codTovara',
    key: 'codTovara',
    render: (text, record) =>{     // Состояние редактирования
      return <Form.Item name="codTovara">
          <p>{text}</p>
        </Form.Item>
    }
  },
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) =>{       // Состояние редактирования
      if(editingRow == record.codTovara){
       return <Form.Item name="name" rules={[{
        required: true,
        message: 'Пожалуйста, введите название товара'
       }]}>
          <Input />
        </Form.Item>
      } else{
        return <p>{text}</p>
      }
    }
  },
  {
    title: 'Срок годности',
    dataIndex: 'dateExpiration', 
    key: 'dateExpiration',
    render: (text, record) =>{                 // Состояние редактирования
      if(editingRow == record.codTovara){
       return <Form.Item name="dateExpiration" rules={[{
        required: true,
        message: 'Пожалуйста, введите срок годности'
       }]}>
          <DatePicker />
        </Form.Item>
      } else{
        return <p>{text}</p>
      }
    }
  },
  {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) =>{                 // Состояние редактирования
        if(editingRow == record.codTovara){
         return <Form.Item name="category" rules={[{
          required: true,
          message: 'Пожалуйста, выберите актегорию'
         }]}>
            <Cascader options={category} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
          </Form.Item>
        } else{
          return <p>{text}</p>
        }
      }
    },
    {
      title: 'Цена для покупателя',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) =>{                  // Состояние редактирования
        if(editingRow == record.codTovara){
         return <Form.Item name="price" rules={[{
          required: true,
          message: 'Пожалуйста, введите цену'
         }]}>
            <Input />
          </Form.Item>
        } else{
          return <p>{text}</p>
        }
      }
    },
    {
    title: "Количество в наличии",
    dataIndex: "count",
    key: "count",
    render: (text, record) =>{                   // Состояние редактирования
      if(editingRow == record.codTovara){
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
    title: 'Действия',
    key: 'action',
    render: (_, record) => {                    // Состояние редактирования
      if(editingRow == record.codTovara){
        return <> <Space wrap> <Button style={{background: "#08979c"}} icon={<SaveOutlined />} htmlType='submit' type="primary"/> 
        <Button style={{background: "#08979c"}} icon={<CloseOutlined />} onClick={Cancel} type="primary"/> </Space> </>
       } else{
      return <>
  <Space wrap>
    <Button style={{background: "#08979c"}} icon={<EditOutlined />} type="primary" onClick={()=>{
      setEditingRow(record.codTovara)
      form.setFieldsValue({
        codTovara: record.codTovara,
        name: record.name,
        category: record.category,
        price: record.price,
        count: record.count,
      });
    }}/>
      <Button style={{background: "#08979c"}} icon={<DeleteOutlined />} onClick={() => deleteItem({ codTovara: record.cod })} type="primary"/>        
  </Space>
  </>
       }
    }    
}
];

/**
   * Столбцы таблицы Товар для пользователя
   */
  const columnsUser = [
    {
      title: 'Код товара',
      dataIndex: 'codTovara',
      key: 'codTovara',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    { 
      title: 'Дата производства',
      dataIndex: 'dateExspiration',
      key: 'dateExspiration',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
    },
    { 
      title: 'Цена для покупателя',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: "Количество в наличии",
      dataIndex: "count",
      key: "count",
    },
  ];

const handleChangePage = (page, pageSize) => {
setCurrentPage(page);
setPageSize(pageSize);
};

let currentData = tovars.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 /**
   * Хук изменений, сслыающийся на состояние функционального компонента. Получает товары с сервера. 
   * 
   */
    useEffect(() => {
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
                        setTovars(data)
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
        getTovars()
    }, [setTovars])

 /**
   * Функция удаления Товара по коду
   * @param {*} cod - код товара
   * @returns 
   */
    const deleteItem = async ({ cod }) => {
      /**
       * определение параметров запроса
       */
        const requestOptions = {
            method: 'DELETE'
        }
        /**
         * тправка DELETE-запроса на сервер
         */
        return await fetch(`https://localhost:7253/api/Tovar/${cod}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    removeTovar(cod);
                    const updatedTovar = tovars.filter((tovars) => tovars.codTovara !== cod)
                    setTovars(updatedTovar)
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
      const tovar = { codTovara: formValues.codTovara, name: formValues.name, dateExpiration: formValues.dateExpiration, category:  String(formValues.category[0]), price: parseFloat(formValues.price), count: parseInt(formValues.count)}
      console.log('Tovar:', tovar);
       // получение код товара
      const cod = formValues.codTovara;

      /**
       * определение асинхронной функции updated для внесения изменений в товар
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
         *  отправка PUT-запроса на сервер
         */
        return await fetch(`https://localhost:7253/api/Tovar/${cod}`, requestOptions)
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
              (error) => { 
                  console.log(error)  // Установить сообщения об ошибках
              }
          )
         }
           updated();
           setEditingRow(null);   // установка состояния редактировния в null(закрытие редактирования строки таблицы)
          
  }

  // возвращение компонента
    return (
      <ErrorBoundary>
        <React.Fragment>
        <Form form={form} onFinish={Save}>
            <Title level={2}>Список товаров</Title>
            <Table columns={ user.isAuthenticated && user.userRole === 'admin' ? (columnsAdmin) : (columnsUser)} rowClassName="editable-row" onChange={handleTableChange} pagination={tableParams.pagination} dataSource={tovars} rowKey="number" />
        </Form>
        </React.Fragment>
        </ErrorBoundary>
    )
}

/**
  *  экспорт компонента Tovar
  */
export default Tovar