import React from 'react'
import './Login.css'
import banner from '../../Assets/Images/login-banner.png'
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const Login = () => {

  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false)


  const baseUri = process.env.REACT_APP_BASE_URL

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {

    setIsLoading(true)
    e.preventDefault();
    const data = {
      phoneNumber: phone,
      password: password
    }

    try {
      const response = await fetch(`${baseUri}/api/trainer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const resdata = await response.json()

      if (response.status === 200) {

        localStorage.setItem('token', resdata.token)
        localStorage.setItem('type', resdata.type)

        console.log("resdata", resdata)

        setIsLoading(false)

        if (resdata.type === 1) {
          navigate('/admin-setup')
        } else if (resdata.type === 2) {
          navigate('/trainer-setup')
        }

      } else {
        setIsLoading(false)
        alert(resdata.error)
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='loginMain'>
      {
        isLoading && (
          <div className="loaderContainer">
            <div className="loader">
              <Oval
                visible={true}
                height="50"
                width="50"
                color="#ffffff"
                ariaLabel="oval-loading"
              // wrapperStyle={{}}
              // wrapperClass=""
              />
            </div>
          </div>

        )
      }

      <span className="">Admin number - 9309125102    </span>
      <span>Trainer Number - 7259035102</span>
      <div className="banner">
        <img src={banner} alt="" />
      </div>
      <div className='loginCard'>
        <span>trainer / admin login 7249035102</span>
        <div className="inputDiv">
          <span className="phoneNumberInput">
            Phone Number
          </span>
          <input type="text" className="" onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="inputDiv">
          <span className="">
            Password
          </span>
          <input type="password" className="" onChange={(e) => setPassword(e.target.value)} />
        </div>


      </div>
      <button className='enterbtn' onClick={handleSubmit}>Enter</button>
    </div>
  )
}

export default Login