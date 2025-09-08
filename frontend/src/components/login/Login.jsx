import React, { useState, useContext } from 'react';
import './Login.css';
import { MyCont } from '../../MyProvi';

function Login() {
    let { api, navi } = useContext(MyCont);
    let [show, setShow] = useState(false);
    let [form, setForm] = useState({
        phone: "",
        pwd: ""
    });
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let res = await api.post('/login', form);
            alert("welcome")
            navi('dashboard')
            localStorage.setItem("curuser",JSON.stringify(res.data.data));
            setForm({
                phone: "",
                pwd: ""
            })
        } catch (error) {
            if (error.message) {
                alert(error.response.data.message)
            }
        }

    }

    function handleChange(e) {
        let { name, value } = e.target;
        setForm((prev => (
            { ...prev, [name]: value }
        )))
    }

    return (
        <div className="signcont">
            <div className="innercont">
                <div className="contleft">
                    <img src="https://media.istockphoto.com/id/1302474481/vector/team-of-men-programmers-working-on-web-development-brainstorming-process-script-coding.jpg?s=612x612&w=0&k=20&c=iUKYMWvTRe-ygGS0gr_kkiIHsPnxnbR4M6xkhos6Z18=" alt="" />
                </div>
                <div className="contrig">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="phone">Phone number:</label>
                            <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                        </div>
                        <div className="pwd">
                            <label htmlFor="pwd">password:</label>
                            <input type={show ? "test" : "password"} name="pwd" value={form.pwd} onChange={handleChange} />
                            <p onClick={() => setShow(prev => !prev)}>show</p>
                        </div>
                        <div>
                            <p>Dont't have an account?<a onClick={() => navi('/signup')}>Sign up</a></p>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;