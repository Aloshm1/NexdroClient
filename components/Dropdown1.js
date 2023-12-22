import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import css from "../styles/dropdown.module.css"


function Dropdown1(props) {
    let [value, setValue] = useState("")
    let [filteredData, setFilteredData] = useState([])
    useEffect(()=>{
        setData(props.arr)
        console.log(props.arr)
    },[props])
    let [data, setData] = useState([])
    let changeHandler =(e) =>{
        setClose(true)
        if(document.getElementById("autocomplete")){

            document.getElementById("autocomplete").scrollTo(0,0)
        }
        setValue(e.target.value)
        let result = data.filter((data) =>
        data
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
        )
        console.log(result)
        if(result.length !== 0){
            setTempData(0)
        }
        setFilteredData(result)
    }
    let entered = (e) =>{
        if((e.key) == "Enter"){
            if(filteredData[tempData]){
                props.enterData(filteredData[tempData])
            }else{

                if(value.trim().length > 1 && value.trim().length < 100){

                    props.enterData(value)
                }
            }
            document.getElementById("input1").focus()
            setValue("")
            setFilteredData([])
            setTempData(0)
        }
        
    }
    let [tempData, setTempData] = useState(0)
    let [close, setClose] = useState(true)
    const upHandler = ({ key }) => {
        console.log(key)
        if(filteredData.length !== 0){
         if(key == "ArrowDown"){
         if(filteredData[tempData+1] !== undefined){
            setTempData(tempData+1)
            document.getElementById("autocomplete").scrollTop += 36
         }
         }
         if(key == "ArrowUp"){
          
            if(filteredData[tempData-1] !== undefined){
                setTempData(tempData-1)
                document.getElementById("autocomplete").scrollTop -= 36
             }
           
         }
         if(key == "Enter"){
       
         
         }
   
        }
        
       };
       React.useEffect(() => {
         window.addEventListener("keyup", upHandler);
     
         return () => {
           window.removeEventListener("keyup", upHandler);
         };
       });
       let selected = (i) =>{
        document.getElementById("input1").focus()
        props.enterData(filteredData[i])
        setFilteredData([])
            setTempData(0)
       }
       let blured = () =>{
        setTimeout(()=>{
            setClose(false)
        },300)
       }
  return (
    <div className={css.mainDiv}>
        <input type="text" className='inputBox' value={value} id="input1" onChange={changeHandler} onKeyUp={entered} onBlur={blured} autoComplete="off"/>{
            filteredData.length !== 0 && close &&
            <div className={css.options} id="autocomplete">
            {
              filteredData.map((item,i)=>{
                    return(
                        <div className={css.item} key={i} style={{backgroundColor: tempData == i ? "#e5e5e5" : "#fff"}} onClick={()=>selected(i)} >{item}</div>
                    )
                })
            }
        </div>
        }
        
    </div>
  )
}

export default Dropdown1