import React,{useState, useEffect} from 'react'

// import { FetchData } from '../utils/FetchData';
import { Form, Input, Button, Select, Row, Col,
    DatePicker, TimePicker, Cascader, TreeSelect, Checkbox, Switch, Alert, Spin,
    ColorPicker
 } from 'antd';
// import { Editor } from './Editor';
// import { url } from '../config';npm 

const { TextArea, Search } = Input;
// const { Title } = Typography;
const { Option } = Select;
const { Group } = Checkbox;
const typeSpecialElement = {

    search:[
        <Search />, //Se usa para buscar un dato
        <Input disabled={true}/>, //Para mostrar el dato encontrado
        <Alert message="mensaje default" style={{padding: 3}} type="info" showIcon />,//Sirve para mostrar texto informativo
        <Input type="text" className='input-idData' />,//Para guardar el id del dato encontrado (en caso de que se necesite)
    ],
    data: [
        <Select />, //Para mostrar los datos encontrados
    ], //Solo para elementos select
    quill: [
        <div></div>
    ],
    colorPicker: [
        <ColorPicker />
    ],
}
const typeElement = {

    text: <Input />,
    password: <Input.Password />,
    email: <Input type="email" />,
    number: <Input type="number" />,
    date: <DatePicker format={"YYYY-MM-DD"} style={{width: "100%"}}/>,
    dateTime: <DatePicker showTime format={"YYYY-MM-DD HH:mm:ss"} style={{width: "100%"}} />,
    time: <TimePicker style={{width: "100%"}} />,
    textArea: <TextArea />,
    textAreaRich: <TextArea />,
    hidden: <Input type="hidden" />,
    cip:<Input maxLength={5}/>,
    empresas: <Input />,

    switch: <Switch />,
    hr: <hr />,
    curp: {
        isSpecial: true,    
        type: "search",
        url: "",
        infoAlert: "Buscar CURP",
        orientation: "horizontal", //vertical
        dataIndex: {
            id: "id",
            text: "nombreCompleto",
        }
    },
    checkboxGroup: <Group />,   
    select: <Select />,
    multiple: <Select mode="multiple" />,
    tags: <Select mode="tags" />,
    combobox: <Select mode="combobox" />,
    cascader: <Cascader />,
    treeSelect: <TreeSelect />,
    colorPicker: {
        isSpecial: true,
        type: "colorPicker",
    },
}

const rgbToHex = (r, g, b) => {
    const toHex = (value) => {
      const hex = Math.round(value).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  


const useSpecialElement = (elementType, propsElement, propsForm, form) => {

    const { type, url, infoAlert, orientation } = elementType;
    const elements = typeSpecialElement[type];
    const [idValue, setIdValue] = useState('');
    const [textValue, setTextValue] = useState('');
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [color, setColor] = useState("#00000");

    useEffect(() => {
        if(type === "data") {
            getDataFetch();
        }

        if(type === "colorPicker") {

            //obtener initialValues
            let colorPicker = form.getFieldValue(propsForm.name);
            console.log(colorPicker)
            colorPicker = colorPicker === undefined || colorPicker === null ? "#00000" : colorPicker;
            form.setFieldsValue({
                [propsForm.name]: colorPicker,
            });
            setColor(colorPicker);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleChangeColor = (color) => {
        const { r, g, b } = color.metaColor;
        const hexColor = rgbToHex(r, g, b);
        console.log(hexColor)
        form.setFieldsValue({
          [propsForm.name]: hexColor,
        });
      };
    const buildOptions = (data) => {
        return data.map((item) => {
            return(
                <Option key={item[elementType.dataIndex.value]} value={parseInt(item[elementType.dataIndex.value])}>  
                    {item[elementType.dataIndex.text]}
                </Option>
            )
        })
    }
    const getDataFetch = () => {
        setIsLoading(true);
        fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("tokenPISnote") 
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.datos){
                setOptions(buildOptions(data.datos));
            }
            if(data.valor){
                setOptions(buildOptions(data.valor));
            }
            if(!data.datos && !data.valor){
                throw new Error("No se encontraron datos");
            }

        })
        .catch((error) => {
                //to do error message
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
    const getDataFetchForSearch = (value) => {  
        setIsLoading(true);
        fetch(url+value,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("tokenPISnote")   }    
        })
        .then((response) => response.json())
        .then((data) => {
            if(data !== null) {
                setIdValue(data.valor[elementType.dataIndex.id]);
                setTextValue(data.valor[elementType.dataIndex.text]);
                form.setFieldsValue({
                    [propsForm.name+"_id"]: data.valor[elementType.dataIndex.id],
                    [propsForm.name+"_text"]: data.valor[elementType.dataIndex.text]

                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }


    if(type === "search") {
        elements[0] = <Search
            placeholder={propsElement.placeholder}
            onSearch={getDataFetchForSearch}
            enterButton
        />
        elements[1] = <Input disabled={true} value={textValue} />
        elements[2] = <Alert message={infoAlert} style={{padding: 3}} type="info" showIcon />
        elements[3] = <Input type="hidden" className='input-idData' value={idValue} />
    }
    if(elements === undefined) {
        return null;
    }

    return (
        <>  
        <Spin spinning={isLoading} >
        { type === "search" ?
            <Row gutter={16} >
                { propsElement.orientation  === "horizontal" && type !== "quill" ?   
                    elements.map((element, index) => {
                        return (
                        <Col span={8} key={index}>
                            {element}
                        </Col>
                        )
                    })
                    :
                    elements.map((element, index) => {
                        return (
                        <Col span={24} style={{
                            marginBottom: 10
                        }} key={index}>
                            {element}
                        </Col>
                        )
                    })
                }
                <Form.Item name={propsForm.name+"_text"} noStyle>
                </Form.Item>
                <Form.Item name={propsForm.name+"_id"} noStyle>
                </Form.Item>    
            </Row>
       
        : 
        type === "data" ?
        <Form.Item name={propsForm.name} >
                <Select>
                    {options}
                </Select>
        </Form.Item>
        :
        type === "quill" ?
        <Form.Item name={propsForm.name} required={false} >
          {/* <Editor id={propsElement.id || propsForm.name + "_quill"}  style={propsElement.style} defaultValue={
            form.getFieldValue(propsForm.name + "asd") || <h3>hola</h3>
          }
          form={form}
          theme='snow'
            /> */}
            {/* <Editor id={propsElement.id || propsForm.name + "_quill"} /> */}
        </Form.Item>
        :
        type === "colorPicker" ?
          <Form.Item name={propsForm.name} >
            <Row>
                <Col span={10}>
                    <ColorPicker size="large" showText value={color} onChange={handleChangeColor} />
                 </Col>
                <Col span={14}> 
                    <Alert type='info' message="Haz click en el recuadro para seleccionar el color."  showIcon={true}/>
                </Col>
            </Row>     
            </Form.Item>
        :
        null
        }
        </Spin>
      </>
    )
}

const useElement = (element, form) => {
    const { type, propsElement, propsForm } = element;

    // Asegurar que el tipo de elemento sea válido
    if (!type || !typeElement[type]) {
        throw new Error(`Tipo de elemento "${type}" no soportado`);
    }

    let elementType = useSpecialElement(typeElement[type], propsElement, propsForm, form);

    // Si elementType sigue siendo undefined o null, utilizar el valor por defecto
    if (!elementType) {
        elementType = React.cloneElement(typeElement[type], propsElement);
    }

    return (
        <Form.Item {...propsForm}>
            {elementType}
        </Form.Item>
    );
}


const buildRows = (elements, form = null) => {
    const rows = new Map();
    elements.forEach((element) => {
        if (!rows.has(element.row)) {
            rows.set(element.row, new Map());
        }
        rows.get(element.row).set(element.col, element);
    });

    const getLengthRow = (rowMap) => rowMap.size;

    return Array.from(rows).map(([key, value]) => {
        const longRow = getLengthRow(value);
        const longCol = longRow > 0 ? Math.floor(24 / longRow) : 24;
        return (
            <Row gutter={16} key={key}>
                {
                    Array.from(value).map(([key, value]) => {
                        return (
                            <Col span={longCol} key={key}>
                                {useElement(value, form)}
                            </Col>
                        )
                    })
                }
            </Row>
        )
    });
}

const buildButtons = (buttons) => {

    return buttons.map((button, index) => {
        return (
            <Button 
                htmlType={button.type === "submit" ? "submit" : "button"}
                key={index}
                {...button.propsElement}
            >
                {button.text}
            </Button>
        )
    })


}

export const ConstructorForm = ({jsonForm = {}, dataForm={}}) => {
   
    //  jsonForm = {
    //     // form: {
    //         title: "Test",
    //         layout: "vertical",
    //         id: "formNota",
    //         initialValues: {
    //             nombre: "",
    //         },
    //         style: {
    //             paddingInline: 10,
    //             margin: 0
    //         },
    //     // },
    //     elements:[
    //         {
    //             type: "curp",
    //             row: 1,
    //             col: 0,
    //             propsForm: {
    //                 label: "Título de la nota",    
    //                 name: "nombre",
    //                 rules: [
    //                     {
    //                         required: true,
    //                         message: "Por favor rellenar campo",
    //                     },
    //                 ],
    //             },
    //             propsElement: {
    //                 placeholder: "Ej. Bienvenido a PISblog",
    //                 // disabled: true,
    //             },
    //         },
    //         {
    //             type: "modulos",
    //             row: 2,
    //             col: 0,
    //             propsForm: {
    //                 label: "Título de la nota",    
    //                 name: "nombre2",
    //                 rules: [
    //                     {
    //                         required: true,
    //                         message: "Por favor rellenar campo",
    //                     },
    //                 ],
    //             },
    //             propsElement: {
    //                 placeholder: "Ej. Bienvenido a PISblog",
    //                 // disabled: true,
    //             },
    //         },
    //         {
    //             type: "checkboxGroup",
    //             row: 3,
    //             col: 0,
    //             propsForm: {
    //                 label: "Título de la nota",    
    //                 name: "nombre5",
    //                 rules: [
    //                     {
    //                         required: true,
    //                         message: "Por favor rellenar campo",
    //                     },
    //                 ],
    //             },
    //             propsElement: {
    //                 placeholder: "Ej. Bienvenido a PISblog",
    //                 // disabled: true,
    //                 options: [
    //                     { label: 'Administrador', value: 1 },
    //                     { label: 'Editor', value: 2 },
    //                 ],
    //             },
    //         },
    //         {
    //             type: "quill",
    //             row: 4,
    //             col: 0,
    //             propsForm: {
    //                 label: "Título de la nota",    
    //                 name: "nombre3",
    //                 rules: [
    //                     {
    //                         required: true,
    //                         message: "Por favor rellenar campo",
    //                     },
    //                 ],
    //             },
    //             propsElement: {
    //                 placeholder: "Ej. Bienvenido a PISblog",
    //                 id: "editor1",
    //                 style: {
    //                     height: 300,
    //                 },
    //                 // disabled: true,
    //             },
    //         },
    //         {
    //             type: "text",
    //             row: 2,
    //             col: 1,
    //             propsForm: {
    //                 label: "Título de la nota",    
    //                 name: "nombre4",
    //                 rules: [
    //                     {
    //                         required: true,
    //                         message: "Por favor rellenar campo",
    //                     },
    //                 ],
    //             },
    //             propsElement: {
    //                 placeholder: "Ej. Bienvenido a PISblog",
    //                 // disabled: true,
    //             },
    //         },
    //     ],
    //     buttons: [
    //         {
    //             type: "submit",
    //             text: "Enviar",
    //             style: {
    //                 width: "135%",
    //             },
    //             propsElement: {
    //                 className: "btnSubmit",
    //                 type: "primary",
    //                 style: {
    //                     width: "100%",
    //                 },
    //             },
    //         }
    //     ]
    // };

    const [form, setForm] = useState(jsonForm);
    const [data, setData] = useState({dataForm, ...jsonForm.initialValues});
    const [uform] = Form.useForm();

    useEffect(() => {
        if(jsonForm) {

            if(!form.onFinish){
                form.onFinish = handleTest;
            }

            setForm(jsonForm);
        }
        if(dataForm) {
            setData(dataForm);
        }
        console.log("cons", jsonForm.initialValues)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTest = (test) => {
        console.log("No hay función asignada")
    }



    return (
        <>
        { data &&
        <Form
            form={uform}
            ref={jsonForm.ref}
            style={form.style}
            name={form.id}
            initialValues={data}
            layout={form.layout}
            onFinish={(data) =>{ form.onFinish(data)}}
        >
            {form.elements && 
                buildRows(form.elements, uform).map((row) => row)
            }
            {form.buttons &&
                buildButtons(form.buttons).map((button) => button)
            }
        </Form>
        }
        </>
    )

}
