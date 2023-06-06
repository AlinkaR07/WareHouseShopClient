/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState} from 'react'
import { Button, Typography, Table, Space} from 'antd';
import { DeleteOutlined} from '@ant-design/icons';
import './Style.css'
import LineWrite from './LinesWrite';
import { ErrorBoundary } from "react-error-boundary";

const { Title } = Typography;

/**
 * определение компонента Write
 * @param {*} user - компонент-пользователь
 * @param {*} removeWrite - функция удаления акта списания
 * @returns 
 */
const Write = ({ user, removeWrite }) => {
const [writes, setWrites] = useState([]); // Состояние актов списания, начальное значение - пустой массив
const [currentPage, setCurrentPage] = useState(1); // Состояние текущей страницы, начальное значение - 1
const [pageSize, setPageSize] = useState(100);  // Состояние размера страницы, начальное значение - 100
const [linewrites, setLineWrites] = useState(false)  // Состояние модальных окон со строками актов списания, начальное значение - false
const removeLineWrite = (removeNumber) => setLineWrites(writes.filter(({ numberAct }) => numberAct !== removeNumber)); // функция удаления акта списания по номеру 
const [user1, setUser] = useState({ isAuthenticated: false, userName: "", userRole: "" });  // объект неавторизованного пользователя
const currentData = writes.slice((currentPage - 1) * pageSize, currentPage * pageSize);


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
   * Столбцы таблицы Акты списания
   */
  const columns = [
    {
      title: 'Номер акта списания',
      dataIndex: 'numberAct',
      key: 'numberAct'
    },
    {
      title: 'Дата списания',
      dataIndex: 'dataWrite',
      key: 'dataWrite',
    },
      {
        title: 'ФИО работника слада',
        dataIndex: 'fiOworker_FK_',
        key: 'fiOworker_FK_',
      },
      {
      title: 'Действия',
      key: 'action',
      render: (text, record) => (
    <Space wrap>
      <LineWrite user={user1} setUser={setUser}  linewrite={linewrites} setLineWrites={setLineWrites} removeLineWrite={removeLineWrite} numberWrite={record.numberAct}/>
      {user.isAuthenticated && user.userRole === 'admin' ? (
        <Button style={{background: "#08979c"}} icon={<DeleteOutlined />} onClick={() => deleteItem({ number: record.number })} type="primary"/>
      ) : (
        ''
      )}
      
    </Space>
  )
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
        setWrites([]);
    }
}

/**
   * Хук изменений, сслыающийся на состояние функционального компонента. Получает акты списания. 
   * 
   */
    useEffect(() => {
        const getWrites = async () => {
            /**
             * определение параметров запроса
             */
            const requestOptions = {
                method: 'GET'
            }
            /**
             * отправка GET-запроса на сервер
             */
            return await fetch("https://localhost:7253/api/Writes", requestOptions)
                .then(response => response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        setWrites(data)
                        setTableParams({
                            ...tableParams,
                            pagination: {
                              ...tableParams.pagination,
                              total: data.totalCount,
                            },
                          });
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
        getWrites()
        
    }, [setWrites])

  /**
   * Функция удаления Акта спсиания по номеру
   * @param {*} number - номер акта списания 
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
        return await fetch(`https://localhost:7253/api/Writes/${number}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    removeWrite(number);
                }
            },
                (error) => console.log(error)
            )
    }
    
    // возвращение компонента
    return (
      <ErrorBoundary>
        <React.Fragment>
            <Title level={2}>Список актов списания</Title>
            <Table columns={columns} onChange={handleTableChange} pagination={tableParams.pagination} dataSource={currentData} rowKey="numberAct" />
        </React.Fragment>
        </ErrorBoundary>
    )
}

export default Write