import React, {useEffect, useState, useRef} from 'react'
import { Button, Input, Table as AntdTable, Tooltip,   Alert } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const { Search } = Input;
export const resetTable = () => document.getElementById('btnReloadTable').click();
export const Table = 
    ({      
    isLoadingParam = false,
    customReload = null,
    onChangeParam = () => {},
    requireButtons=[
        "reload"
    ],
    jsonButtons = {
    },
    columns=[], rowKey = "", dataArray = [], dataUrl="", urlPost="", urlPut="", urlDelete=""
    }) => {
        const [data, setData] = useState([]);
        const [isLoading, setLoading] = useState(false);
        const [itemsBtn, setItemsBtn] = useState([]);
        const [columnsSource, setColumnsSource] = useState([]);
        const [searchedColumn, setSearchedColumn] = useState('');
        const [searchText, setSearchText] = useState('');
        const [alertMessage, setAlertMessage] = useState("");
        const [alertDescription, setAlertDescription] = useState("");
        const [alertType, setAlertType] = useState("info"); 
        const searchInput = useRef(null);
        const [isFirstCharge, setIsFirstCharge] = useState(true);
        useEffect(() => {
            getButtonsTable();
            buildTable(dataUrl, columns);
            setIsFirstCharge(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {

            if(dataUrl.trim() === "" || !dataUrl || isFirstCharge){
                return;
            }
            getData(dataUrl)
            .then((newData) => {
                if(newData && newData !== undefined && newData !== null){
                    setData(currentData => [...currentData, ...newData]);
                }
            });

            getButtonsTable();

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [dataUrl]);

        useEffect(() => {

            if(!isFirstCharge){
                setLoading(isLoadingParam);
            }
            
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isLoadingParam]);

        useEffect(() => {
            if(dataArray.length > 0){
                setData(dataArray);
            }
            
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [dataArray]);


        useEffect(() => {

            //despues de 10 segundos se cierra el mensaje
            setTimeout(() => {
                setAlertMessage("");
                setAlertDescription("");
                setAlertType("info");
            }, 10000);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [alertMessage]);

        // const getDataSource = async (url) => {
        //     const newData = await getData(url);    
        //     if(newData && newData != undefined && newData != null){
        //         setData(currentData => [...currentData, ...newData]);
        //     }
        // }

        const reloadTable = () => {
        
            if(customReload){
                customReload();
                return;
            }
            buildTable(dataUrl, columns)
        
        };

        const alertSuccess = (message, description) => {
            setAlertMessage(message);
            setAlertDescription(description);
            setAlertType("success");
        }

        const alertError = (message, description) => {
            setAlertMessage(message);
            setAlertDescription(description);
            setAlertType("error");
        }

        const alertWarning = (message, description) => {    
            setAlertMessage(message);
            setAlertDescription(description);
            setAlertType("warning");
        }

        const getData = async (url = "") => {
            try{
                setLoading(true);
                

                if(url === "") throw new Error();

                const response = await fetch(url,{
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer "+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp2YWxlbnp1ZWxhMUB1Y29sLm14IiwiaWRVc3UiOiIzOTE4IiwiaWRBcHAiOiIxNTciLCJub21BcHAiOiJSZXBvcnRlcyBkZSBBbWVuYXphcyBlIEluY2lkZW50ZXMiLCJpZFJvbCI6IjYiLCJpZFJvbEFwcCI6IjIiLCJpZFBlcnNvbmEiOiIzMjExMiIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJpZEFQSVBhZHJlIjoiMCIsImF1dG9yaWRhZCI6IjEiLCJodXNvIjoiQW1lcmljYS9NZXhpY29fQ2l0eSIsImh1c28yIjoiNiIsIm5iZiI6MTcxOTQyMTQyOSwiZXhwIjoxNzE5NDUwMjI5LCJpYXQiOjE3MTk0MjE0MjksImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.iKWivJyRVQJaWtk0b9Lray2JYq_c6ODa2-BDVQPyx-M' 

                    }
                });
                setLoading(false);
                
                const data = await response.json() || null;
                
                if(data.error || response.status !== 200 || data === null) throw new Error();

                if(data.datos.length <= 0){
                    alertWarning("Warning", "No hay datos para mostrar");
                } 

                alertSuccess("Success", "Datos obtenidos correctamente");
                return data.datos;
            }catch(error){
                alertError("Error", "Error al obtener los datos");
                return;
            }
        }

        const checkTypeColumns = (columnsParam) => {
            columnsParam.forEach((column)=>{
                if(!column.type)
                    column.type = 'number';
            });
            return columnsParam;
        }

        const getButtonsTable = () => { 

            const buttonsTable = requireButtons.map((button) => {
                if(button === "reload"){
                    return {
                        key: "reload",
                        type: "button",
                        icon: <ReloadOutlined />,
                        text: "Recargar tabla",
                        onClick: reloadTable
                    }
                }
                const btnJson = jsonButtons.map((btn) => {
                    if(btn.key === button){
                        return btn;
                    }
                    return null;
                });
                return btnJson[0] || null;
            });
            const items = buttonsTable.map((button) => {
            
                if(button.type === "button"){
                    return (
                        <Tooltip title={button.text} key={button.key}>
                         <Button key={button.key} icon={button.icon} onClick={button.key === "reload" ? reloadTable : button.onClick}/>
                         </Tooltip>
                        )
                }

                if(button.type === "search"){
                    return (
                        <Tooltip title={button.text} key={button.key}>
                            <Search
                                ref={searchInput}
                                style={button.style}
                                placeholder={button.text}
                                onSearch={button.onClick}
                                enterButton
                            />
                        </Tooltip>
                    )
                }

                return null;
            });        //remove null
            items.filter((item) => item !== null);

            setItemsBtn(items);
        }

        const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            let value = selectedKeys[0]
            setSearchText(value);
            setSearchedColumn(dataIndex);
        };
        const handleCloseSearch = (close) => { 
            
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 100);
            close();

        }

        const filterSearchProps = (column) => {
            const props = {
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                    <div
                      style={{
                        padding: 8,
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
 
                      <Search 
                        placeholder={`Buscar ${column.title}`} 
                        onSearch={() => handleSearch(selectedKeys, confirm, column.dataIndex, column.type)} 
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        enterButton={<SearchOutlined/>}
                        style={{
                            marginBottom: 8,
                            display: 'block',
                          }}
                        />
                        <Button
                          type="default"
                          size="small"
                          onClick={() => handleCloseSearch(close)}
                        >
                          Cancelar
                        </Button>
                    </div>
                  ),
                  filterIcon: (filtered) => (
                    <SearchOutlined
                      style={{
                        color: filtered ? '#1677ff' : undefined,
                      }}
                    />
                  ),
                  onFilter: (value, record) => { 
                    return record[column.dataIndex].toString().toLowerCase().includes(value.toLowerCase());
                },
                  onFilterDropdownOpenChange: (visible) => {
                    if (visible) {
                      setTimeout(() => searchInput.current?.select(), 100);
                    }
                  },
                  render:  searchedColumn === column.dataIndex ? (text) =>
                    (
                      <Highlighter
                        highlightStyle={{
                          backgroundColor: '#ffc069',
                          padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                      />
                    ) : column.render,
            }
            return props;
        }

        const filterSorterProps = (column) => {

            const types = {
                folio: (a, b) => a[rowKey] - b[rowKey],
                number: (a, b) => a[column.dataIndex] - b[column.dataIndex],
                text: (a, b) => a[column.dataIndex].localeCompare(b[column.dataIndex]),
                date: (a, b) => new Date(a[column.dataIndex]) - new Date(b[column.dataIndex]),
                boolean: (a, b) => a[column.dataIndex] - b[column.dataIndex]
            }

            return types[column.type];
        }

        const getFilters = (column) => {
    
            let filters = {};
            if(column.type !== 'action'){

                if(column.type !== 'number' && column.type !== 'boolean' && column.type !== 'date')
                    filters = filterSearchProps(column);
                
                filters.sorter = filterSorterProps(column);
                filters.sortDirections = ['descend', 'ascend'];
            
            }
            return filters;
        }

        const buildTable = async(url, columnsParam) => {
            const columnsTable = checkTypeColumns(columnsParam);
            const columnsWithFilter = columnsTable.map((column) => { 
                const filters = getFilters(column);
                column = {...column, ...filters};
                return column;
            });
            console.log(columnsWithFilter);
            setColumnsSource(columnsWithFilter);
            if(url.trim() === "" || !url) return;
            const data =  await getData(url);
            setData(data);
            return true;
        }


        const handleCloseAlert = () => {
            setAlertMessage("");
            setAlertDescription("");
            setAlertType("info");
        }

        const isLastPage = (indexPage, pageSize) => indexPage === Math.ceil(data.length / pageSize);

  return (
    <>
        <div  className='scrollable-div'>
                    <div style={{
                        width: '50%',
                    }}>   
                        {itemsBtn}
                    </div>
                        { alertMessage !== "" &&
                        <Alert 
                            onClick={handleCloseAlert}
                            style={{ margin: 5 }}
                            message={alertMessage}
                            description={alertDescription}
                            showIcon
                            type={alertType}
                            onClose={handleCloseAlert} // Agrega esta línea para manejar el cierre del Alert
                        />
                        }
                    <AntdTable style={{width: "100%"}} 
                    pagination={{
                    onChange: (page, pageSize) => {
                        const objData = {
                            isLastPage: isLastPage(page,pageSize),
                            page: page,
                            pageSize: pageSize

                        }
                        onChangeParam(objData)
                    },
                }} columns={columnsSource} loading={isLoading}  dataSource={data} rowKey={rowKey} />
        </div>
    </>
  )
}