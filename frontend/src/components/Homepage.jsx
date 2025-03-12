import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {
            name:"",
            language : "",
        }
    )

    console.log(formData);

    const changeHandler = (e) =>{
        console.log(e.target);
        setFormData((prev)=>{
            return {
                ...prev,
                [e.target.name] : e.target.value,
            }
        })

    }

    const submitHandler = (e) =>{
        e.preventDefault();
        
        navigate(`/ground/123?name=${formData.name}&langauge=${formData.language}`);
    }

  return (
    <div>
        <p>Homepage</p>
        
        <form>

            <label htmlFor='name' >name</label>
            <input id='name' name='name' onChange={changeHandler} value={formData.name} type='text'></input>

            <label htmlFor='language' >langauge</label>
            <input id='langauge' name='language' onChange={changeHandler} value={formData.language} type='text' ></input>
            
            <button type='submit' onClick={submitHandler} >submit</button>

        </form>

    </div>
  )
}


export default Homepage;