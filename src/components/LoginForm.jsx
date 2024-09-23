import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormInput from './FormInput'
import useForm from '../hooks/useForm'
import { loginUser } from '../utils/axios'
import { toast } from 'react-toastify'
import { useUser } from '../context/UserContext'
import { useEffect } from 'react'
import { json, useNavigate } from 'react-router-dom'
const initialState={
  email:"",
  password:""
}
const LoginForm = () => {
  const {user, setUser} = useUser()
  const navigate = useNavigate()
  const { form, setForm, handleOnChange } = useForm(initialState)
    const loginFields = [
      {
        name: 'email',
        label: 'Email address',
        type: 'email',
        required: true,
        placeholder: 'Enter email',
        value: form.email
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Enter password',
        value:form.password
      },
    ]
   const handleOnSubmit = async(e)=>{
      e.preventDefault();
   
     
      const pendingPromise = loginUser(form)
      toast.promise(pendingPromise,{
        pending: "logging..."
      })
      const result = await pendingPromise

      const {status, message, user, accessJWT} = result
      localStorage.setItem("accessJWT", accessJWT)
      // localStorage.setItem("userInfo", JSON.stringify(user))
      toast[status](message)
      setUser(user)
      setForm(initialState)
   }
    useEffect(()=>{
       user?._id && navigate("/dashboard")
    },[user?._id, navigate])
  return (
    <Form onSubmit={handleOnSubmit}>
      {
        loginFields.map((field)=>{
            return (
              <FormInput
                key={field.name}
                label={field.label}
                {...field}
                onChange={handleOnChange}
              />
            )
        })
      }
     
      <Button variant="primary" type="submit" className="w-100 mt-2">
        Submit
      </Button>
    </Form>
  )
}
export default LoginForm
