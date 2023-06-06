/**
 * импорт необходимых компонентов из библиотеки Ant Design
 */
import React, { useEffect, useState} from "react"
import { UserOutlined, PlusOutlined, MinusCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import { Button, Input, DatePicker, Cascader, Form, Select, Modal, Space} from 'antd';
import FormItem from "antd/es/form/FormItem";
import { ErrorBoundary } from "react-error-boundary";

let tovar = []; // массив для получения списка товаров
const tovarCascader = [];  // массив для получения списка товаров в cascader 

/**
 * Функция обработки события-выбора в компоненте DatePicker
 * @param {*} date 
 * @param {*} dateString 
 * @returns 
 */
const onChangeDatePicker = (date, dateString) => {
    console.log(date, dateString);
  };

  /**
   * Функция обработки события-выбора в компоненте cascader
   * @param {*} value 
   * @returns 
   */
const onChangeCascader = (value) => {
    console.log(value);
  };

const displayRender = (labels) => labels[labels.length - 1]; // Хук отображения Cascader

/**
 * определение компонента WriteCreate
 * @param {*} user - компонент-пользователь
 * @param {*} addWrite - функция добавления акта списания
 * @param {*} addLineWrite - функция добавления строк актов списаний
 * @returns 
 */
const WriteCreate = ({ user, addWrite, addLineWrite }) => {
  const [open, setOpen] = useState(false) // Состояние модального окна
  const [writes, setWrites] = useState([]); // Состояние актов списания, начальное значение - пустой массив
  const [linewrites, setLineWrites] = useState([]); // Состояние строк актов списаний, начальное значение - пустой массив
  const [tovars, setTovars] = useState([]); // Состояние товаров, начальное значение - пустой массив
  const [ form ] = Form.useForm(); // определение формы

  /**
   * Функция открытия модального окна
   */
  const showModal = () => {
    setOpen(true);
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
        setWrites([]);
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
   Функция добавления заказа - строки таблицы
  * @param {*} formValues - значения, который вводил пользователь в компоненты формы
  */
  const writeCreate = (formValues) => {
      console.log("Success:", formValues)
        // формирование объекта для запроса
      const write = { fIOworker_FK_: formValues.FIOworker, dataWrite: formValues.DataWrite, lineWrites: null}
      let idTovar; // id товара в Таблице
      let updateCountTovar; // количество, на которое будет изменять количество товара в наличии
      console.log(write);

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
        body: JSON.stringify(write),
      }      

      /**
       * отправка POST-запроса на сервер
       */
        const response = await fetch("https://localhost:7253/api/Writes", requestOptions)
        return await response.json()
        .then((data) => {
                       console.log(data)
                   if (response.ok) {
                     addWrite(data)
                     setWrites(data)
                     let i=0;
                     for(i; i<formValues.lineswrite.length; i++) {
                      let k=0;
                      for(k; k<tovar.length; k++){
                       let j=0;
                       if(formValues.lineswrite[i].nameTovar[0] === tovar[k][j+1]){     // нахождение id товара, который изменяется
                              idTovar = tovar[k][j];
                              break;
                       }
                      }
                      // формирование объекта для запроса
                     const linewrite = {name: String(formValues.lineswrite[i].nameTovar[0]),  summa: parseFloat(formValues.lineswrite[i].Summa), count: parseInt(formValues.lineswrite[i].CountWrite), codTovara_FK_: idTovar, NumberActWrite_FK_: data.numberAct}
                     updateCountTovar = parseInt(formValues.lineswrite[0].CountWrite); // определяем количество, на которое будет изменять количество товара в наличии товара
                     console.log('LineWrite:', linewrite);
                    
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
                        body: JSON.stringify(linewrite),
                      }
                      /**
                       * отправка POST-запроса на сервер
                       */
                     const response = await fetch("https://localhost:7253/api/LinesWrite", requestOptions)
                     return await response.json()
                     .then((data) => {
                       console.log(data)
                        if (response.ok) {
                          addLineWrite(data)
                          setLineWrites(data)
                       }
                    },
                   (error) => console.log(error)   // Установить сообщения об ошибках
              )
            }
            createline() 

            /**
             * 
             * @returns определение асинхронной функции GetTovar для полчкния товара по id
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
                    const tovar = { codTovara: idTovar, name: data.name, dateExpiration: data.dateExpiration, category: data.category, price: data.price, count: data.count-updateCountTovar}
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
                                console.log(error)   // Установить сообщения об ошибках
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
        {user.isAuthenticated ? (
            <h3>Создание нового акта списания</h3>) : ( ""
            )}
            <Form 
            form={form}
            onFinish={writeCreate}
            name="basic"
            style={{
              maxWidth: 600,
            }}
            autoComplete="off">
                <Form.Item  label="ФИО сотрудника:" name="FIOworker" placeholder="Введите ФИО"
          rules={[
           {
             message: 'Пожалуйста, введите свое ФИО!',
           },
                ]}>
               <Input prefix={<UserOutlined/>} />
             </Form.Item>
             <Form.Item label="Дата списания:" name="DataWrite" >
             <DatePicker onChange={onChangeDatePicker}/>
               </Form.Item>
               <h4>Введите данные о товаре(название товара, сумму списания, количество):</h4>
                <Form.Item>
                <Form.List name="lineswrite">
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
                name={[name, 'nameTovar']}              >
                <Cascader options={tovarCascader} expandTrigger="hover" displayRender={displayRender} onChange={onChangeCascader} />
                
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'Summa']}
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, введите сумму!',
                  },
                ]}
              >
                <Input placeholder="Введите сумму" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'CountWrite']}
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
              Добавить товар в акт списания
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
           </> ) : ( ""
            )}
            {user.isAuthenticated ? (
           <div><Button style={{background: "#08979c"}} icon={<PlusOutlined />} type="primary" name="addnewwrite" onClick={showModal}>Создать новый акт списания</Button></div>) : ( ""
           )}   
            </>  
            </ErrorBoundary>   
    )
}

/**
  *  экспорт компонента WriteCreate
  */
export default WriteCreate
